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

const reset = (data) => {
  const roomba = roombas[data.hash];
  
  switch(roomba.playerNum) {
        case 1:
          roomba.position.x = 110;
          roomba.destPosition.x = 110;
          roomba.position.y = 110;
          roomba.destPosition.y = 110;
          break;
        case 2:
          roomba.position.x = 430;
          roomba.destPosition.x = 430;
          roomba.position.y = 110;
          roomba.destPosition.y = 110;
          break;
        case 3:
          roomba.position.x = 110;
          roomba.destPosition.x = 110;
          roomba.position.y = 430;
          roomba.destPosition.y = 430;
          break;
        case 4:
          roomba.position.x = 430;
          roomba.destPosition.x = 430;
          roomba.position.y = 430;
          roomba.destPosition.y = 430;
          break;
        default:
          break;
      }
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
  
  if(roomba.velocity.x > roomba.maxSpeed) {
    roomba.velocity.x = roomba.maxSpeed;
  } else {
    roomba.velocity.x += roomba.acceleration.x;
  }
  
  if(!(roomba.moveLeft) && !(roomba.moveRight)) {
    roomba.velocity.x -= roomba.acceleration.x * 5;
    if(roomba.velocity.x < 0) {
      roomba.velocity.x = 0;
    }
  } else { 
    if(roomba.velocity.x > roomba.maxSpeed) {
      roomba.velocity.x = roomba.maxSpeed;
    } else {
        roomba.velocity.x += roomba.acceleration.x;
    }
  }
  
  if(!(roomba.moveUp) && !(roomba.moveDown)) {
    roomba.velocity.y -= roomba.acceleration.y * 5;
    if(roomba.velocity.y < 0) {
      roomba.velocity.y = 0;
    }
  } else { 
    if(roomba.velocity.y > roomba.maxSpeed) {
      roomba.velocity.y = roomba.maxSpeed;
    } else {
        roomba.velocity.y += roomba.acceleration.y;
    }
  }
  
  console.log(roomba.velocity.y);
  
  if(roomba.moveUp && roomba.destPosition.y > 0) {
    roomba.destPosition.y -= roomba.velocity.y;
  }
  if(roomba.moveDown && roomba.destPosition.y < 540) {
    roomba.destPosition.y += roomba.velocity.y;
  }
  if(roomba.moveLeft && roomba.destPosition.x > 0) {
    roomba.destPosition.x -= roomba.velocity.x;
  }
  if(roomba.moveRight && roomba.destPosition.x < 540) {
    roomba.destPosition.x += roomba.velocity.x;
  }
  
  roomba.alpha = 0.05;
  
  socket.emit('movementUpdate', roomba);
};