'use strict';

const net = require('net');
const PORT = process.env.PORT || 3000;
const server = net.createServer();

server.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});
