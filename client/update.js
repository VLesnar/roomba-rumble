const update = (data) => {
  if(!roombas[data.hash]) {
    roombas[data.hash] = data;
    return;
  }
  
  if(data.hash === hash) {
    return;
  }
  
  if(roombas[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }
  
  const roomba = roombas[data.hash];
  roomba.prevX = data.prevX;
  roomba.prevY = data.prevY;
  roomba.destX = data.destX;
  roomba.destY = data.destY;
  roomba.cx = data.cx;
  roomba.cy = data.cy;
  roomba.moveLeft = data.moveLeft;
  roomba.moveRight = data.moveRight;
  roomba.moveUp = data.moveUp;
  roomba.moveDown = data.moveDown;
  roomba.alpha = 0.05;
};

const setUser = (data) => {
  hash = data.hash;
  roombas[hash] = data;
  requestAnimationFrame(redraw);
};

const removeUser = (data) => {
  if(roombas[data.hash]) {
    delete roombas[data.hash];
  }
};

const updatePosition = () => {
  const roomba = roombas[hash];
  
  roomba.prevX = roomba.x;
  roomba.prevY = roomba.y;
  roomba.cx = roomba.x + 30;
  roomba.cy = roomba.y + 30;
  
  if(roomba.moveUp && roomba.destY > 0) {
    roomba.destY -= 2;
  }
  if(roomba.moveDown && roomba.destY < 540) {
    roomba.destY += 2;
  }
  if(roomba.moveLeft && roomba.destX > 0) {
    roomba.destX -= 2;
  }
  if(roomba.moveRight && roomba.destX < 540) {
    roomba.destX += 2;
  }
  
  roomba.alpha = 0.05;
  
  socket.emit('movementUpdate', roomba);
};