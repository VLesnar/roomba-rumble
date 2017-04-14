class Roomba {
  constructor(hash, playerNum, roomNum, posX, posY) {
    this.hash = hash;
    this.lastUpdate = new Date().getTime();
    this.playerNum = playerNum;
    this.roomNum = roomNum;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
    this.posX = posX;
    this.posY = posY;
    this.prevX = posX;
    this.prevY = posY;
    this.destX = posX;
    this.destY = posY;
    this.cX = posX + 30;
    this.cY = posY + 30;
    this.radius = 30;
    this.alpha = 0;
  }
}

module.exports = Roomba;