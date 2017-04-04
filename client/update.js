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
  
  if(roomba.moveUp && roomba.destY > 0) {
    roomba.destY -= 2;
  }
  if(roomba.moveDown && roomba.destY < 400) {
    roomba.destY += 2;
  }
  if(roomba.moveLeft && roomba.destX > 0) {
    roomba.destX -= 2;
  }
  if(roomba.moveRight && roomba.destX < 400) {
    roomba.destX += 2;
  }
  
  roomba.alpha = 0.05;
  
  socket.emit('movementUpdate', roomba);
};