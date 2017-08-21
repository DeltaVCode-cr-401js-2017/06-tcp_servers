'use strict';

const net = require('net');
const PORT = process.env.port || 3000;
const server = net.createServer();

const EE = require('events');
const ee = new EE();

const pool = [];
const uuid = require('uuid/v4');

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

    console.log(`Client ${receiver.nickname} receiving message`);
    receiver.socket.write(`${sender.nickname}: ${message}`);
  });
});

server.on('connection', function(socket){
  var client = new Client(socket);
  pool.push(client);
  socket.write(`Welcome. Your ID is ${client.id}.\r\n`);
  socket.write(`\t Type @nick to change your nickname \t\n Type @close to exit.\t\n Type @dm followed my a User ID or nickname to direct message a user\n`);

  ee.emit('@all', client, `Welcome, ${client.id} to the chat!\n`);

  socket.on('data', function (data) {
    console.log(data);

    ee.emit('@all', client, data.toString());

  });
  
});
