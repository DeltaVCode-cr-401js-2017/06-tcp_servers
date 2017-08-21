'use strict';

const uuidv4 = require('uuid/v4');
const net = require('net');
const PORT = process.env.PORT || 3000;
const server = net.createServer();

const clientPool = [];

function Client(socket){
  this.nickname = 'anon';
  this.id = uuidv4;
  socket;
}

server.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});

server.on('connection', (socket) => {
  let newClient = new Client(socket);
  clientPool.push(newClient);
  socket.on('data', function (data) {
    console.log(data);
    //handle data
  });
  socket.on('close', function () {
    //remove from clientPool
  });
  socket.on('error', function (err) {
    console.warn();(err);
    //handle data
  });
});
