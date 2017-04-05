class Roomba {
  constructor(hash, playerNum, x, y) {
    this.hash = hash;
    this.lastUpdate = new Date().getTime();
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.destX = x;
    this.destY = y;
    this.radius = 30;
    this.alpha = 0;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
    this.playerNum = playerNum;
  }
}

module.exports = Roomba;
