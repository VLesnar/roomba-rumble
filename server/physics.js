const sockets = require('./sockets.js');

let roombas = {};

// If the players are colliding, move the players
// Originally supposed to simulate a bounce, discarded because I'm bad at physics...
// For now...
const movePlayers = (self, opp) => {
  // If the opposing player comes from a direction, move the player along the same direction
  if(opp.moveLeft) {
    self.destX -= 10;
    self.posX -= 10;
  }
  if(opp.moveRight) {
    self.destX += 10;
    self.posX += 10;
  }
  if(opp.moveUp) {
    self.destY -= 10;
    self.posY -= 10;
  }
  if(opp.moveDown) {
    self.destY += 10;
    self.posY += 10;
  }

  sockets.handleCollision(self);
};

// Check to see if the player has fallen off the arena
const checkFall = () => {
  const keys = Object.keys(roombas);

  for (let i = 0; i < keys.length; i++) {
    const roomba = roombas[keys[i]];
    
    // Does the circle leave the square?
    if ((roomba.posX + roomba.radius) < 100 || (roomba.posX + roomba.radius) > 500 ||
       (roomba.posY + roomba.radius) < 100 || (roomba.posY + roomba.radius) > 500) {
      sockets.handleFall(roomba);
    }
  }
};

// Check to see if two players are colliding
const checkCollision = (hash) => {
  const roomba1 = roombas[hash];
  const keys = Object.keys(roombas);
  
  for (let i = 0; i < keys.length; i++) {
    const roomba2 = roombas[keys[i]];
    if (roomba1 === undefined || roomba1.hash === roomba2.hash) {
      return;
    }
    
    // Are two circles intersecting?
    const distX = roomba1.posX - roomba2.posX;
    const distY = roomba1.posY - roomba2.posY;
    const radius = roomba1.radius + roomba2.radius;
    if (((distX * distX) + (distY * distY)) <= radius * radius) {
      movePlayers(roomba1, roomba2);
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

setInterval(() => {
  const keys = Object.keys(roombas);

  for (let i = 0; i < keys.length; i++) {
    if (!(i + 2 > keys.length)) {
      const roomba1 = roombas[keys[i]];
      const roomba2 = roombas[keys[i + 1]];
      checkCollision(roomba1, roomba2);
    }
  }
}, 20);

module.exports.setRoombaList = setRoombaList;
module.exports.setRoomba = setRoomba;
module.exports.checkCollision = checkCollision;
