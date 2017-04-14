const xxh = require('xxhashjs');
const Roomba = require('./classes/Roomba.js');
const physics = require('./physics.js');

const roombas = {};

let io;
let roomCount = 0;  // Used to determine which room a socket and player is in
let playerNum = 1;  // Used to tell a player which number they are; i.e. player 1

// Emit to the room if a roomba is colliding
const handleCollision = (roomba) => {
  io.sockets.in(`room${roomba.roomNum}`).emit('updatedCollision', roomba);
};

// Emit to the room if a roomba has fallen off the arena
const handleFall = (roomba) => {
  io.sockets.in(`room${roomba.roomNum}`).emit('fellOff', roomba);
};

const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;
    
    socket.join(`room${roomCount}`);
    
    const idString = `${socket.id}${new Date().getTime()}`;
    const hash = xxh.h32(idString, 0xCAFEBABE).toString(16);
    
    socket.hash = hash;
    
    let posX = 0;
    let posY = 0;
    
    // Setup roomba position based on their player number
    switch (playerNum) {
      case 1:
        posX = 110;
        posY = 110;
        break;
      case 2:
        posX = 430;
        posY = 110;
        break;
      case 3:
        posX = 110;
        posY = 430;
        break;
      case 4:
        posX = 430;
        posY = 430;
        break;
      default:
        break;
    }
    
    roombas[hash] = new Roomba(hash, playerNum, roomCount, posX, posY);
    playerNum++;  // Increment for next player
    socket.roomNum = roomCount; // Store what room this socket is in
    
    // If the player number is greater than four, the max player count for a room has been reached;
    // Increment the room number and set the player number back to 1
    if(playerNum > 4) {
      roomCount++;
      playerNum = 1;
    }
    
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
module.exports.handleCollision = handleCollision;
module.exports.handleFall = handleFall;
