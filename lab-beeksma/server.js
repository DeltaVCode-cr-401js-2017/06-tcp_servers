'use strict';

const uuidv4 = require('uuid/v4');
const net = require('net');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const EE = require('events');
const ee = new EE();

const clientPool = [];

function Client(socket){
  this.nickname = 'default';
  this.id = uuidv4();
  this.socket = socket;
}

ee.on('@all', function (sender, message) {
  if(sender.nickname === 'default'){
    sender.socket.write(`You must set your nickname before sending a message.  Use '@nickname <newNickname>' to change your nickname. \r\n> `);
    return;
  }
  clientPool.forEach(receiver => {
    if (receiver.id === sender.id) return;

    console.log(`Client ${receiver.id} receiving message`);
    receiver.socket.write(`${sender.nickname}: ${message}\r\n> `);
    sender.socket.write(`\r\n> `);
  });
});

ee.on('@dm', function (sender, target, message) {
  if(sender.nickname === 'default'){
    sender.socket.write(`You must set your nickname before sending a message.  Use '@nickname <newNickname>' to change your nickname. \r\n> `);
    return;
  }
  clientPool.forEach(receiver => {
    if(receiver.nickname === target){
      console.log(`Client ${receiver.id} receiving message`);
      receiver.socket.write(`dm from ${sender.nickname}: ${message}\r\n> `);
      sender.socket.write(`\r\n> `);
    }
  });
});

ee.on('@nickname', function (sender, newNickname) {
  let usedNicknames = clientPool.map(client => client.nickname);
  if(usedNicknames.indexOf(newNickname) === -1){
    sender.nickname = newNickname;
    console.log(`Client ${sender.id} nickname changed to ${sender.nickname}`);
    sender.socket.write(`Your nickname has been changed to: ${sender.nickname}\r\n> `);
  }
  else{
    sender.socket.write(`${newNickname} is already in use, please try again.\r\n> `);
  }
});

server.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});

server.on('connection', (socket) => {
  let client = new Client(socket);
  clientPool.push(client);
  socket.write(`Welcome to chat, your nickname is ${client.nickname}.  Please use '@nickname <newNickname>' to change your nickname.  Please use '@all <message>' to message all users, '@dm <nickname> <message>'  to message only a specific user.\r\n> `);
  socket.on('data', function (data) {
    console.log(data);
    dataHandler(data,client);
  });
  socket.on('close', function () {
    closeSocket(client);
  });
  socket.on('error', function (err) {
    console.warn();(err);
  });
});

function dataHandler(data,client){
  let dataArray = data.toString().split(' ');
  if(dataArray[0] === '@all'){
    console.log(data.toString().replace('@all ', ''));
    ee.emit('@all', client, data.toString().replace('@all ', ''));
  }
  else if(dataArray[0] === '@dm') {
    ee.emit('@dm', client, dataArray[1].replace(/\r?\n|\r/gm,''), data.toString().replace(`@dm ${dataArray[1]} `, ''));
  }
  else if(dataArray[0] === '@nickname') {
    ee.emit('@nickname', client, dataArray[1].replace(/\r?\n|\r/gm,''));
  }
  else {
    client.socket.write(`Sorry, that is not a valid command, try '@all <message>' to message all users, '@dm <nickname> <message>'  to message a specific user, or '@nickname <newNickname>' to change your nickname.\r\n> `);
  }
}

function closeSocket(client){
  if(clientPool.indexOf(client) != -1){
    console.log(`Client ${client.nickname}: ${client.id} has left.`);
    clientPool.splice(clientPool.indexOf(client), 1);
    console.log(clientPool.map(activeClient => activeClient.id));
  }
}
