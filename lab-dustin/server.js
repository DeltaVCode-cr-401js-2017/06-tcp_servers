'use strict';

const net = require('net');
const PORT = process.env.PORT || 3000
const server = net.createServer();
const constructor = require('./client-constructor');

const EE = require('events');
const ee = new EE();

const pool = [];

ee.on('@all',function(sender,message){
  pool.forEach(receiver => {
    if (receiver.id === sender.id) return;

    console.log(`Client ${receiver.id} receiving message`);
    receiver.socket.write(`${sender.id}: ${message}`);
  });
});

server.on('connection',function(socket){
  var client = new constructor.Client(socket)
  pool.push(client);

  socket.on('data',function(data){
    ee.emit('@all',client,data.toString());
    /*
    pool.forEach(function(Client){
      Client.socket.write(`Someone said: ${data.toString()}`);
    });
    */
  });
});

server.listen(PORT,function(){
  console.log(`Listening on ${PORT}`);
});
