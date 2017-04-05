const xxh = require('xxhashjs');
const Roomba = require('./classes/Roomba.js');
const physics = require('./physics.js');

const roombas = {};

let io;
let roomCount = 0;
let playerNum = 1;

const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;

    socket.join(`room${roomCount}`);

    const idString = `${socket.id}${new Date().getTime()}`;
    const hash = xxh.h32(idString, 0xCAFEBABE).toString(16);
    let x = 0;
    let y = 0;

    switch (playerNum) {
      case 1:
        x = 110;
        y = 110;
        break;
      case 2:
        x = 430;
        y = 110;
        break;
      case 3:
        x = 110;
        y = 430;
        break;
      case 4:
        x = 430;
        y = 430;
        break;
      default:
        break;
    }

    roombas[hash] = new Roomba(hash, playerNum, x, y);
    playerNum++;

    if (playerNum > 4) {
      playerNum = 1;
    }

    const keys = Object.keys(roombas);

    socket.roomNum = roomCount;
    if (keys.length % 4 === 0) {
      roomCount++;
    }

    socket.hash = hash;
    socket.emit('joined', roombas[hash]);

    socket.on('movementUpdate', (data) => {
      roombas[socket.hash] = data;
      roombas[socket.hash].lastUpdate = new Date().getTime();

      physics.setRoomba(roombas[socket.hash]);

      io.sockets.in(`room${socket.roomNum}`).emit('updatedMovement', roombas[socket.hash]);
    });
    
    setInterval(() => {
      physics.checkCollision(socket.hash);
    }, 20);

    socket.on('disconnect', () => {
      io.sockets.in(`room${socket.roomNum}`).emit('disconnected', roombas[socket.hash]);

      delete roombas[socket.hash];

      physics.setRoombaList(roombas);

      socket.leave(`room${socket.roomNum}`);
    });
  });
};

module.exports.setupSockets = setupSockets;
