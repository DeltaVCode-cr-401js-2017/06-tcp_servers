'use strict';
const uuidv4 = require('uuid-v4');

exports.Client = function(socket){
  this.id = uuidv4();
  this.socket = socket;
};
