const xxh = require('xxhashjs');
const Roomba = require('./classes/Roomba.js');
const physics = require('./physics.js');
const Victor = require('victor');

const roombas = {};

let io;
let roomCount = 0;
let playerNum = 1;

const handleFall = (roomba) => {
  io.sockets.in(`room${roomba.roomNum}`).emit('fellOff', roomba);
};

const handleCollision = (data) => {
  const roomba1 = data.player;
  const roomba2 = data.opponent;
  
  io.sockets.in(`room${roomba1.roomNum}`).emit('updatedMovement', roomba1);
  io.sockets.in(`room${roomba2.roomNum}`).emit('updatedMovement', roomba2);
};

const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;

    socket.join(`room${roomCount}`);

    const idString = `${socket.id}${new Date().getTime()}`;
    const hash = xxh.h32(idString, 0xCAFEBABE).toString(16);
    const position = new Victor(0, 0);

    switch (playerNum) {
      case 1:
        position.x = 110;
        position.y = 110;
        break;
      case 2:
        position.x = 430;
        position.y = 110;
        break;
      case 3:
        position.x = 110;
        position.y = 430;
        break;
      case 4:
        position.x = 430;
        position.y = 430;
        break;
      default:
        break;
    }

    roombas[hash] = new Roomba(hash, playerNum, roomCount, position);
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
module.exports.handleFall = handleFall;
module.exports.handleCollision = handleCollision;
