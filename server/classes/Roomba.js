const Victor = require('victor');

class Roomba {
  constructor(hash, playerNum, roomNum, position) {
    this.hash = hash;
    this.lastUpdate = new Date().getTime();
    this.position = position;
    this.prevPosition = position;
    this.destPosition = position;
    this.center = new Victor(position.x + 30, position.y + 30);
    this.radius = 30;
    this.velocity = new Victor(0, 0);
    this.acceleration = new Victor(0.03, 0.03);
    this.maxSpeed = 3;
    this.alpha = 0;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
    this.playerNum = playerNum;
    this.roomNum = roomNum;
  }
}

module.exports = Roomba;
