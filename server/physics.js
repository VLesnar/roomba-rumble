//const sockets = require('./sockets.js');

let roombas = {};

const checkFall = () => {
  const keys = Object.keys(roombas);

  for (let i = 0; i < keys.length; i++) {
    const roomba = roombas[keys[i]];

    if ((roomba.x + roomba.radius) < 100 || (roomba.x + roomba.radius) > 500 ||
       (roomba.y + roomba.radius) < 100 || (roomba.y + roomba.radius) > 500) {
      console.log('Success');
    }
  }
};

const setRoombaList = (roombaList) => {
  roombas = roombaList;
};

const setRoomba = (roomba) => {
  roombas[roomba.hash] = roomba;
};

setInterval(() => {
  checkFall();
}, 20);

module.exports.setRoombaList = setRoombaList;
module.exports.setRoomba = setRoomba;
