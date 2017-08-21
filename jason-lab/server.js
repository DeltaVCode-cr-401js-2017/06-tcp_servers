'use strict';

const net = require('net');
const PORT = process.env.port || 3000;
const server = net.createServer;

const EE = require('events');
const ee = new EE();

const pool = [];
const uuidv4 = require('uuid/v4');

ee.on('@all', function (sender, message){
  pool.forEach(client=>{
    client.socket.write(`${sender.id}: ${message}`);
  });
});

let id = 1;
server.on('connection', function(socket){
  const client = {
    id: id++,
    socket
  };
});

socket.write(`Welcome. Your ID is ${client.id}.\r\n`);
pool.push(client);

socket.on('data', function (data){
  console.log(data);
  ee.emit('@all', client, )
})
