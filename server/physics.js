const sockets = require('./sockets.js');

let roombas = {};

const setRoombaList = (roombaList) => {
  roombas = roombaList;
};

const setRoomba = (roomba) => {
  roombas[roomba.hash] = roomba;
};

module.exports.setRoombaList = setRoombaList;
module.exports.setRoomba = setRoomba;