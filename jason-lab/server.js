'use strict';

const net = require('net');
const PORT = process.env.port || 3000;
const server = net.createServer;

const EE = require('events');
const ee = new EE();

const pool = [];
const uuid = require('uuid/v4');

function Client(socket){
  this.nickname = 'guest';
  this.socket = socket;
  this.id = uuid.v4();
}

server.listen('PORT', function(){
  console.log(`server is listening on ${PORT}`);
});

server.on('connection', function(socket){
  var client = new Client(socket);
  pool.push(client);
  socket.write(`Welcome. Your ID is ${client.id}.\r\n`);
  socket.write(`Type @nick to change your nickname \r\n
                Type @close to exit.\r\n
                Type @dm followed my a User ID or nickname to direct message a user\r\n`);
  ee.emit('@all', client, `Welcome, ${client.id} to the chat!`);
});

ee.on('@all', function (sender, message){
  pool.forEach(client=>{
    client.socket.write(`${Client.nickname}: ${message}`);
  });
});
socket.on('close', function(socket){
  
});

socket.on('data', function (data){
  console.log(data);
})
