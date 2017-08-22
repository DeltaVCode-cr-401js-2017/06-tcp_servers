'use strict';

const net = require('net');
const PORT = process.env.port || 3000;
const server = net.createServer();

const EE = require('events');
const ee = new EE();

const ansi = require('ansi')
  , cursor = ansi(process.stdout);

const pool = [];
const uuid = require('uuid/v4');

const helpMenu = `Type @nick folowed by a nickname of your choice to change your nickname
\n\t- nicknames can not have spaces -
\n\t- nicknames can contain letters, numbers, or a combination of both -
\t\n Type @close to exit.
\t\n Type @dm followed my a User ID or nickname to direct message a user\n`;

function Client(socket){
  this.nickname = 'guest';
  this.socket = socket;
  this.id = uuid();
}

server.listen(PORT, function(){
  console.log(`server is listening on ${PORT}`);
});

ee.on('@all', function (sender, message) {
  pool.forEach(receiver => {
    if (receiver.id === sender.id) return;
    receiver.socket.write(`${sender.nickname}: ${message}`);
  });
});

ee.on('@dm', function (sender, string){
  let nickname = string.split(' ').shift().cursor.orange();
  console.log(nickname);
  let message = string.split(' ').slice(1).join(' ');
  console.log(message);

  pool.forEach( person => {
    if(person.nickname === nickname) {
      sender.socket.write(`Message sent to  ${person.nickname}\n`);
      person.socket.write(`You recived a private message from ${sender.nickname}: ${message}\n`);
    }
  });

});


ee.on('@nick', function(client, string) {
  client.socket.write('Your nickname is now: ' + `${string}\n`);
  client.nickname = string.trim();
});

ee.on('default', function (client){
  client.socket.write(`Add an @ before your commands. \t\n
    ${helpMenu}`);
});

ee.on('@close', function (client){
  client.socket.end();
});

server.on('connection', function(socket){
  var client = new Client(socket);
  pool.push(client);
  socket.write(`Welcome. Your ID is ${client.id}.\r\n`);
  socket.write(`\n ${helpMenu}`);
  cursor.reset();


  ee.emit('@all', client, `Welcome, ${client.id} to the chat!\n`);

  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift();
    if (command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });

  socket.on('close', function () {
    console.log(`Client ${client.id} has left.`);
    pool.splice(pool.indexOf(client), 1);
    console.log(pool.map(c => c.id));

    ee.emit('@all', client, `Thanks for chatting!, ${client.id} has left the chat!\n`);
  });

});
