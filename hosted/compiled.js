"use strict";

var lerp = function lerp(v0, v1, alpha) {
  return (1 - alpha) * v0 + alpha * v1;
};

// Draw to the canvas based on game state
var redraw = function redraw(time) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(arenaImage, 0, 0);

  // If at the start menu
  if (gameState === 'start') {
    updateColor();
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText('Roomba Rumble', canvas.width / 2, canvas.height / 2);

    // This text transitions between two colors
    ctx.fillStyle = "rgb(" + redVal + ", " + greenVal + ", 0)";
    ctx.font = "28px sans-serif";
    ctx.fillText('Press Spacebar to Play', canvas.width / 2, canvas.height / 2 + 52);

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.strokeText('Press Spacebar to Play', canvas.width / 2, canvas.height / 2 + 52);
  }
  // If playing the game
  else if (gameState === 'game') {
      updatePosition();

      var keys = Object.keys(roombas);

      for (var i = 0; i < keys.length; i++) {
        var roomba = roombas[keys[i]];

        if (roomba.alpha < 1) {
          roomba.alpha += 0.05;
        }

        roomba.posX = lerp(roomba.prevX, roomba.destX, roomba.alpha);
        roomba.posY = lerp(roomba.prevY, roomba.destY, roomba.alpha);

        // Draws a different colored roomba based on the player's number
        // 1 - Red, 2 - Yellow, 3 - Blue, 4 - Green
        switch (roomba.playerNum) {
          case 1:
            ctx.drawImage(roombaRed, roomba.posX, roomba.posY);
            break;
          case 2:
            ctx.drawImage(roombaYellow, roomba.posX, roomba.posY);
            break;
          case 3:
            ctx.drawImage(roombaBlue, roomba.posX, roomba.posY);
            break;
          case 4:
            ctx.drawImage(roombaGreen, roomba.posX, roomba.posY);
            break;
          default:
            break;
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = "20px sans-serif";
        ctx.fillText("Player " + roomba.playerNum, roomba.cX, roomba.cY + 20);
      }
    }
    // If the game is over
    else if (gameState === 'end') {
        updateColor();
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 37);

        ctx.font = "28px sans-serif";
        ctx.fillText("You took x place", canvas.width / 2, canvas.height / 2);

        // This text transitions between two colors
        ctx.fillStyle = "rgb(" + redVal + ", " + greenVal + ", 0)";
        ctx.fillText('Press Spacebar', canvas.width / 2, canvas.height / 2 + 52);
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.strokeText('Press Spacebar', canvas.width / 2, canvas.height / 2 + 52);
        ctx.fillStyle = "rgb(" + redVal + ", " + greenVal + ", 0)";
        ctx.fillText('to Return to Start', canvas.width / 2, canvas.height / 2 + 82);
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.strokeText('to Return to Start', canvas.width / 2, canvas.height / 2 + 82);
      }

  requestAnimationFrame(redraw);
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var socket = void 0;
var hash = void 0;
var gameState = void 0; // Holds the current game state
var arenaImage = void 0; // Holds the arena image  
var redVal = void 0; // Used to hold a red color value for the draw function
var greenVal = void 0; // Used to hold a green color value for the draw function
var direction = void 0; // Used to hold which direction the color values should move for the draw function
var roombaRed = void 0; // Holds the red roomba image
var roombaYellow = void 0; // Holds the yellow roomba image
var roombaBlue = void 0; // Holds the blue roomba image
var roombaGreen = void 0; // Holds the green roomba image
var roombas = {}; // Holds all players in a room

var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;

  // Only check if the game is in play
  if (gameState === 'game') {
    var roomba = roombas[hash];

    // W or UP
    if (keyPressed === 87 || keyPressed === 38) {
      roomba.moveUp = true;
    }

    // A or LEFT
    else if (keyPressed === 65 || keyPressed === 37) {
        roomba.moveLeft = true;
      }

      // S or DOWN
      else if (keyPressed === 83 || keyPressed === 40) {
          roomba.moveDown = true;
        }

        // D or RIGHT
        else if (keyPressed === 68 || keyPressed === 39) {
            roomba.moveRight = true;
          }

    if (roomba.moveUp || roomba.moveDown || roomba.moveLeft || roomba.moveRight) {
      e.preventDefault();
    }
  }
};

var keyUpHandler = function keyUpHandler(e) {
  var keyPressed = e.which;

  // If the spacebar is pressed, do different actions depending on gamestate
  // SPACEBAR
  if (keyPressed === 32) {
    if (gameState === 'start') {
      connect();
      gameState = 'game';
    } else if (gameState === 'game') {
      reset();
      gameState = 'end';
    } else if (gameState === 'end') {
      gameState = 'start';
    }
  }

  // Only check if playing the game
  if (gameState === 'game') {
    var roomba = roombas[hash];

    // W or UP
    if (keyPressed === 87 || keyPressed === 38) {
      roomba.moveUp = false;
    }

    // A or LEFT
    else if (keyPressed === 65 || keyPressed === 37) {
        roomba.moveLeft = false;
      }

      // S or DOWN
      else if (keyPressed === 83 || keyPressed === 40) {
          roomba.moveDown = false;
        }

        // D or RIGHT
        else if (keyPressed === 68 || keyPressed === 39) {
            roomba.moveRight = false;
          }
  }
};

var init = function init() {
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
'use strict';

// Add the user upon establishing a socket.io connection
var setUser = function setUser(data) {
  hash = data.hash;
  roombas[hash] = data;
  requestAnimationFrame(redraw);
};

// Remove the user from the user list upon disconnection
var removeUser = function removeUser(data) {
  if (roombas[data.hash]) {
    delete roombas[data.hash];
  }
};

// Update position for a collision
var updateCollision = function updateCollision(data) {
  var roomba = roombas[data.hash];
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
var update = function update(data) {
  // If the user does not already exist in the user list
  if (!roombas[data.hash]) {
    roombas[data.hash] = data;
    return;
  }

  // Only update users that aren't the user coming in
  if (data.hash === hash) {
    return;
  }

  // Disregard if old information
  if (roombas[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }

  var roomba = roombas[data.hash];
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
var updateColor = function updateColor() {
  redVal += 3 * direction;
  greenVal += 3 * direction;

  if (redVal < 0 && greenVal < 0) {
    direction = 1;
  }
  if (redVal > 255 && greenVal > 255) {
    direction = -1;
  }
};

// Updates the position of a user
var updatePosition = function updatePosition() {
  var roomba = roombas[hash];

  roomba.prevX = roomba.posX;
  roomba.prevY = roomba.posY;
  roomba.cX = roomba.posX + 30;
  roomba.cY = roomba.posY + 30;

  if (roomba.moveUp && roomba.destY > 0) {
    roomba.destY -= 3;
  }
  if (roomba.moveDown && roomba.destY < 540) {
    roomba.destY += 3;
  }
  if (roomba.moveLeft && roomba.destX > 0) {
    roomba.destX -= 3;
  }
  if (roomba.moveRight && roomba.destX < 540) {
    roomba.destX += 3;
  }

  roomba.alpha = 0.05;

  socket.emit('movementUpdate', roomba); // Emit to sockets
};

// If a user falls off the platform
var reset = function reset(data) {
  // The user
  if (hash === data.hash) {
    var roomba = roombas[data.hash];

    // Place them in a safe spot on the screen
    // Originally used for debugging
    switch (roomba.playerNum) {
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
  } else {
    // Remove the user from the user list
    removeUser(data);
  }
};

// Establish a socket.io connection once the game begins
var connect = function connect() {
  socket = io.connect();

  socket.on('joined', setUser);
  socket.on('updatedMovement', update);
  socket.on('updatedCollision', updateCollision);
  socket.on('fellOff', reset);
  socket.on('disconnected', removeUser);
};
