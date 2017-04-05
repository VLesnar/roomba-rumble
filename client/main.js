let canvas;
let ctx;
let arenaImage;
let roombaRed;
let roombaYellow;
let roombaBlue;
let roombaGreen;
let socket;
let hash;
let roombas = {};

const keyDownHandler = (e) => {
  const keyPressed = e.which;
  const roomba = roombas[hash];
  
  // W or UP
  if(keyPressed === 87 || keyPressed === 38) {
    roomba.moveUp = true;
  }
  
  // A or LEFT
  else if(keyPressed === 65 || keyPressed === 37) {
    roomba.moveLeft = true;
  }
  
  // S or DOWN
  else if(keyPressed === 83 || keyPressed === 40) {
    roomba.moveDown = true;
  }
  
  // D or RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    roomba.moveRight = true;
  }
};

const keyUpHandler = (e) => {
  const keyPressed = e.which;
  const roomba = roombas[hash];
  
  // W or UP
  if(keyPressed === 87 || keyPressed === 38) {
    roomba.moveUp = false;
  }
  
  // A or LEFT
  else if(keyPressed === 65 || keyPressed === 37) {
    roomba.moveLeft = false;
  }
  
  // S or DOWN
  else if(keyPressed === 83 || keyPressed === 40) {
    roomba.moveDown = false;
  }
  
  // D or RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    roomba.moveRight = false;
  }
};

const init = () => {
  arenaImage = document.querySelector('#arena');
  roombaRed = document.querySelector('#roombared');
  roombaYellow = document.querySelector('#roombayellow');
  roombaBlue = document.querySelector('#roombablue');
  roombaGreen = document.querySelector('#roombagreen');
  
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');
  
  socket = io.connect();
  
  socket.on('joined', setUser);
  socket.on('updatedMovement', update);
  socket.on('disconnected', removeUser);
  
  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
};

window.onload = init;
