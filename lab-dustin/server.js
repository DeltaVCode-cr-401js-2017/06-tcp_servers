'use strict';

const net = require('net');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const constructor = require('./client-constructor');

const EE = require('events');
const ee = new EE();

const pool = [];

ee.on('@all',function(sender,message){
  pool.forEach(receiver => {
    if (receiver.id === sender.id) return;

    receiver.socket.write(`${sender.id}: ${message}\r\n`);
  });
});

ee.on('@username',function(sender,name){
  console.log(name,sender.id);
  var usernameExists = false;
  pool.forEach(function(user){
    if (user.id === name){
      sender.socket.write('Username already exists.\r\n');
      usernameExists = true;
    }
  });

  if (!usernameExists){
    sender.socket.write(`${sender.id} changed username to: ${name}\r\n`);
    sender.id = name;
  }
});

ee.on('@dm',function(sender,destination,message){
  pool.forEach(function(receiver){
    console.log(receiver);
    if (receiver.id === destination){
      receiver.socket.write(`${sender.id}: ${message}\r\n`);
    }
  });
});

server.on('connection',function(socket){
  var client = new constructor.Client(socket);
  pool.push(client);
  console.log(`${client.id} joined. Users active: ${pool.length}`);
  socket.write('Commands are prefixed with @\r\n');

  socket.on('data',function(data){
    var startCommand = data.toString('utf-8').indexOf('@');
    var endCommand = data.toString('utf-8').indexOf(' ');
    var command = data.toString('utf-8').slice(startCommand,endCommand);

    if (command === '@all'){
      ee.emit('@all',client,data.toString().trim().slice(++endCommand));
    } else if (command === '@username'){
      ee.emit('@username',client,data.toString().trim().slice(++endCommand));
    } else {
      ee.emit(
        '@dm',
        client,
        data.toString().trim().slice(startCommand + 1,endCommand),
        data.toString().trim().slice(endCommand + 1)
      );
    }
  });

  server.on('error',err => {
    console.error(err);
  });

  socket.on('close', function () {
    console.log(`Client ${client.id} has left.`);
    pool.splice(pool.indexOf(client), 1);
    console.log(pool.map(c => c.id));
  });
});

server.listen(PORT,function(){
  console.log(`Listening on ${PORT}`);
});
