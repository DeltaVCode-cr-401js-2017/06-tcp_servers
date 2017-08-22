# ChatBot Documentation

## Overview
This is a basic channel based chat bot running on a simple node server.
This assignment was designed to practice using a TCP connection to the node server.
I only coded 3 commands: \@all,\@username, \@<user>
  - \@all <message> command will send a message to all users that are logged in
  - \@username <username> command will change the current username if it is not already taken
  - \@<user> <message> command will send a direct <message> to <user>

Given more time, my next step would be to add some more commands such as a help guide, as well as implement support for group chats.

## Running this Project
First thing's first, wee are going to want to do an npm install to get all of our packages, then we want to in our terminal `$ npm start` to start our server. Make sure you are in this directory!: `/06-tcp_servers/lab-dustin` Next we want to run our linux shells(I recommend 3 to test direct message functionality) and run `telnet localhost 3000`. This should link you to the server and you may now play around with the few commands that I have written.
