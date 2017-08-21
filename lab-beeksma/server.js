'use strict';

const uuidv4 = require('uuid/v4');
const net = require('net');
const PORT = process.env.PORT || 3000;
const server = net.createServer();

const clientPool = [];

server.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});
