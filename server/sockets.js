const xxh = require('xxhashjs');
const Roomba = require('./classes/Roomba.js');
const physics = require('./physics.js');

const roombas = {};

let io;
let roomCount = 0;

const setupSockets = (ioServer) => {
  io = ioServer;
  
  io.on('connection', (sock) => {
    const socket = sock;
    
    socket.join(`room${roomCount}`);
    
    const idString = `${socket.id}${new Date().getTime()}`;
    const hash = xxh.h32(idString, 0xCAFEBABE).toString(16);
    
    roombas[hash] = new Roomba(hash);
    
    const keys = Object.keys(roombas);

    socket.roomNum = roomCount;
    if(keys.length % 4 === 3) {
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
    
    socket.on('disconnect', () => {
      io.sockets.in('room1').emit('disconnected', roombas[socket.hash]);
      
      delete roombas[socket.hash];
      
      physics.setRoombaList(roombas);
      
      socket.leave(`room${socket.roomNum}`);
    });
  });
};

module.exports.setupSockets = setupSockets;
