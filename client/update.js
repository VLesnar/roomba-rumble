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
  roomba.prevPosition = data.prevPosition;
  roomba.destPosition = data.destPosition;
  roomba.center = data.center;
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
  
  roomba.prevPosition = roomba.position;
  roomba.center.x = roomba.position.x + 30;
  roomba.center.y = roomba.position.y + 30;
  
  if(roomba.moveUp && roomba.destPosition.y > 0) {
    roomba.destPosition.y -= 2;
  }
  if(roomba.moveDown && roomba.destPosition.y < 540) {
    roomba.destPosition.y += 2;
  }
  if(roomba.moveLeft && roomba.destPosition.x > 0) {
    roomba.destPosition.x -= 2;
  }
  if(roomba.moveRight && roomba.destPosition.x < 540) {
    roomba.destPosition.x += 2;
  }
  
  roomba.alpha = 0.05;
  
  socket.emit('movementUpdate', roomba);
};