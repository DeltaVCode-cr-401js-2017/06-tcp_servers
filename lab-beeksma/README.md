# 401-js day 06 lab

### About:
  This project uses the net module of node.js to set up a TCP server and handle simple commands from connecting sockets.   When a socket connects to the server a client is created for that socket, with a unique id, and a default username.  Listeners are also set up for that socket listening for any data, error, or close. If data is passed the server will accept the commands '@all', '@dm', and '@nickname'.  
  - '@all <message>' will send the message to every connected client.
  - '@dm <nickname> <message>' will send the message to the specific client that has that nickname.

### Get server running:
To start the server navigate into the lab-beeksma folder.  Run npm install in your terminal to install the needed modules.  Run NPM start to start the server.

### Connect to server:
To connect to the server use your telnet client of choice.  For the commands to work your telnet client must be in line mode, not character mode.  Telnet to localhost 3000 and you will get a connected message and a welcome message.  You may now use any of the commands.
