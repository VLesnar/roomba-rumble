// Add the user upon establishing a socket.io connection
const setUser = (data) => {
  hash = data.hash;
  roombas[hash] = data;
  requestAnimationFrame(redraw);
};

// Remove the user from the user list upon disconnection
const removeUser = (data) => {
  if(roombas[data.hash]) {
    delete roombas[data.hash];
  }
};

// Update position for a collision
const updateCollision = (data) => {
  const roomba = roombas[data.hash];
  roomba.prevX = data.prevX;
  roomba.prevY = data.prevY;
  roomba.posX = data.posX;
  roomba.posY = data.posY;
  roomba.destX = data.destX;
  roomba.destY = data.destY;
  roomba.cX = data.cX;
  roomba.cY = data.cY;
  roomba.moveLeft = data.moveLeft;
  roomba.moveRight = data.moveRight;
  roomba.moveUp = data.moveUp;
  roomba.moveDown = data.moveDown;
  roomba.alpha = 0.05;
};

// Update position for general movement
const update = (data) => {
  // If the user does not already exist in the user list
  if(!roombas[data.hash]) {
    roombas[data.hash] = data;
    return;
  }
  
  // Only update users that aren't the user coming in
  if(data.hash === hash) {
    return;
  }
  
  // Disregard if old information
  if(roombas[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }
  
  const roomba = roombas[data.hash];
  roomba.prevX = data.prevX;
  roomba.prevY = data.prevY;
  roomba.posX = data.posX;
  roomba.posY = data.posY;
  roomba.destX = data.destX;
  roomba.destY = data.destY;
  roomba.cX = data.cX;
  roomba.cY = data.cY;
  roomba.moveLeft = data.moveLeft;
  roomba.moveRight = data.moveRight;
  roomba.moveUp = data.moveUp;
  roomba.moveDown = data.moveDown;
  roomba.alpha = 0.05;
};

// Updates color values to be used in splash screen text
const updateColor = () => {
  redVal += 3 * direction;
  greenVal += 3 * direction;
  
  if(redVal < 0 && greenVal < 0) {
    direction = 1;
  }
  if(redVal > 255 && greenVal > 255) {
    direction = -1;
  }
};

// Updates the position of a user
const updatePosition = () => {
  const roomba = roombas[hash];
  
  roomba.prevX = roomba.posX;
  roomba.prevY = roomba.posY;
  roomba.cX = roomba.posX + 30;
  roomba.cY = roomba.posY + 30;


  if(roomba.moveUp && roomba.destY > 0) {
    roomba.destY -= 3;
  }
  if(roomba.moveDown && roomba.destY < 540) {
    roomba.destY += 3;
  }
  if(roomba.moveLeft && roomba.destX > 0) {
    roomba.destX -= 3;
  }
  if(roomba.moveRight && roomba.destX < 540) {
    roomba.destX += 3;
  }
  
  roomba.alpha = 0.05;
  
  socket.emit('movementUpdate', roomba);  // Emit to sockets
};

// If a user falls off the platform
const reset = (data) => {
  // The user
  if(hash === data.hash) {     
    const roomba = roombas[data.hash];
    
    // Place them in a safe spot on the screen
    // Originally used for debugging
    switch(roomba.playerNum) {
          case 1:
            roomba.posX = 110;
            roomba.destX = 110;
            roomba.posY = 110;
            roomba.destY = 110;
            break;
          case 2:
            roomba.posX = 430;
            roomba.destX = 430;
            roomba.posY = 110;
            roomba.destY = 110;
            break;
          case 3:
            roomba.posX = 110;
            roomba.destX = 110;
            roomba.posY = 430;
            roomba.destY = 430;
            break;
          case 4:
            roomba.posX = 430;
            roomba.destX = 430;
            roomba.posY = 430;
            roomba.destY = 430;
            break;
          default:
            break;
        }
    
    // Empty their user list for reassignment
    roombas = {};
    // Switch game states
    gameState = 'end';
    // Disconnect the user from socket.io
    socket.emit('disconnect');
  }
  else {
    // Remove the user from the user list
    removeUser(data);
  }
};

// Establish a socket.io connection once the game begins
const connect = () => {
  socket = io.connect();
  
  socket.on('joined', setUser);
  socket.on('updatedMovement', update);
  socket.on('updatedCollision', updateCollision);
  socket.on('fellOff', reset);
  socket.on('disconnected', removeUser);
};