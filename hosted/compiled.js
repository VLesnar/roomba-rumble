"use strict";

var lerp = function lerp(v0, v1, alpha) {
  return (1 - alpha) * v0 + alpha * v1;
};

var redraw = function redraw(time) {
  updatePosition();

  ctx.drawImage(arenaImage, 0, 0);

  var keys = Object.keys(roombas);

  for (var i = 0; i < keys.length; i++) {
    var roomba = roombas[keys[i]];

    if (roomba.alpha < 1) {
      roomba.alpha += 0.05;
    }

    roomba.position.x = lerp(roomba.prevPosition.x, roomba.destPosition.x, roomba.alpha);
    roomba.position.y = lerp(roomba.prevPosition.y, roomba.destPosition.y, roomba.alpha);

    switch (roomba.playerNum) {
      case 1:
        ctx.drawImage(roombared, roomba.position.x, roomba.position.y);
        break;
      case 2:
        ctx.drawImage(roombayellow, roomba.position.x, roomba.position.y);
        break;
      case 3:
        ctx.drawImage(roombablue, roomba.position.x, roomba.position.y);
        break;
      case 4:
        ctx.drawImage(roombagreen, roomba.position.x, roomba.position.y);
        break;
      default:
        break;
    }
  }

  ctx.filter = "none";

  requestAnimationFrame(redraw);
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var arenaImage = void 0;
var roombaRed = void 0;
var roombaYellow = void 0;
var roombaBlue = void 0;
var roombaGreen = void 0;
var socket = void 0;
var hash = void 0;
var roombas = {};

var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;
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
};

var keyUpHandler = function keyUpHandler(e) {
  var keyPressed = e.which;
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
};

var init = function init() {
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
'use strict';

var update = function update(data) {
  if (!roombas[data.hash]) {
    roombas[data.hash] = data;
    return;
  }

  if (data.hash === hash) {
    return;
  }

  if (roombas[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }

  var roomba = roombas[data.hash];
  roomba.prevPosition = data.prevPosition;
  roomba.destPosition = data.destPosition;
  roomba.center = data.center;
  roomba.moveLeft = data.moveLeft;
  roomba.moveRight = data.moveRight;
  roomba.moveUp = data.moveUp;
  roomba.moveDown = data.moveDown;
  roomba.alpha = 0.05;
};

var setUser = function setUser(data) {
  hash = data.hash;
  roombas[hash] = data;
  requestAnimationFrame(redraw);
};

var removeUser = function removeUser(data) {
  if (roombas[data.hash]) {
    delete roombas[data.hash];
  }
};

var updatePosition = function updatePosition() {
  var roomba = roombas[hash];

  roomba.prevPosition = roomba.position;
  roomba.center.x = roomba.position.x + 30;
  roomba.center.y = roomba.position.y + 30;

  if (roomba.moveUp && roomba.destPosition.y > 0) {
    roomba.destPosition.y -= 2;
  }
  if (roomba.moveDown && roomba.destPosition.y < 540) {
    roomba.destPosition.y += 2;
  }
  if (roomba.moveLeft && roomba.destPosition.x > 0) {
    roomba.destPosition.x -= 2;
  }
  if (roomba.moveRight && roomba.destPosition.x < 540) {
    roomba.destPosition.x += 2;
  }

  roomba.alpha = 0.05;

  socket.emit('movementUpdate', roomba);
};
