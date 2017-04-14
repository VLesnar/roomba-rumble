let canvas;
let ctx;
let socket;
let hash;
let gameState;  // Holds the current game state
let arenaImage; // Holds the arena image  
let redVal; // Used to hold a red color value for the draw function
let greenVal; // Used to hold a green color value for the draw function
let direction;  // Used to hold which direction the color values should move for the draw function
let roombaRed;  // Holds the red roomba image
let roombaYellow; // Holds the yellow roomba image
let roombaBlue; // Holds the blue roomba image
let roombaGreen;  // Holds the green roomba image
let roombas = {}; // Holds all players in a room

const keyDownHandler = (e) => {
  const keyPressed = e.which;
  
  // Only check if the game is in play
  if(gameState === 'game') {
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
    
    if(roomba.moveUp || roomba.moveDown || roomba.moveLeft || roomba.moveRight) {
      e.preventDefault();
    }
  }
};

const keyUpHandler = (e) => {
  const keyPressed = e.which;
  
  // If the spacebar is pressed, do different actions depending on gamestate
  // SPACEBAR
  if(keyPressed === 32) {
    if(gameState === 'start') {
      connect();
      gameState = 'game';
    } else if(gameState ==='game') {
      reset();
      gameState = 'end';
    } else if(gameState ==='end') {
      gameState = 'start';
    }
  }
  
  // Only check if playing the game
  if(gameState === 'game') {
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
  
  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
  
  gameState = 'start';
  
  redVal = 0;
  greenVal = 0;
  direction = -1;
  
  requestAnimationFrame(redraw);
};

window.onload = init;