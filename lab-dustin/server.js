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

ee.on('@nickname',function(sender,name){
  console.log(`${sender.id} requests username change.`)
});

server.on('connection',function(socket){
  var client = new constructor.Client(socket);
  pool.push(client);
  socket.write(`Welcome. Your ID is ${client.id}.\r\n`);
  console.log(`New user joined. Users active: ${pool.length}`);

  socket.on('data',function(data){
    var startCommand = data.toString('utf-8').indexOf('@');
    var endCommand = data.toString('utf-8').indexOf(' ');
    var command = data.toString('utf-8').slice(startCommand,endCommand);
    console.log(command);

    if (command === '@all'){
      ee.emit('@all',client,data.toString().slice(++endCommand));
    }
    if (command === '@nickname'){
      console.log('Change nickname');
      ee.emit('@nickname',client,data.toString().slice(++endCommand));
    }
  });

  server.on('error',err => {
    console.error(err);
  });

  socket.on('close', function () {
    console.log(`Client ${client.id} has left.`);
    pool.splice(pool.indexOf(client), 1);
    console.log(`Users active: ${pool.length}`);
    console.log(pool.map(c => c.id));
  });
});

server.listen(PORT,function(){
  console.log(`Listening on ${PORT}`);
});
