const lerp = (v0, v1, alpha) => {
  return (1 - alpha) * v0 + alpha * v1;
};

// Draw to the canvas based on game state
const redraw = (time) => {
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.drawImage(arenaImage, 0, 0);
  
  // If at the start menu
  if(gameState === 'start') {
    updateColor();
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText('Roomba Rumble', canvas.width / 2, canvas.height / 2);
    
    // This text transitions between two colors
    ctx.fillStyle = `rgb(${redVal}, ${greenVal}, 0)`;
    ctx.font = "28px sans-serif";
    ctx.fillText('Press Spacebar to Play', canvas.width / 2, canvas.height / 2 + 52);
    
    ctx.fillStyle = `rgb(0, 0, 0)`;
    ctx.strokeText('Press Spacebar to Play', canvas.width / 2, canvas.height / 2 + 52);
  }
  // If playing the game
  else if(gameState === 'game') {
    updatePosition();
    
    const keys = Object.keys(roombas);
  
    for(let i = 0; i < keys.length; i++) {
      const roomba = roombas[keys[i]];
      
      if(roomba.alpha < 1) {
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
      ctx.fillStyle = `rgb(0, 0, 0)`;
      ctx.font = "20px sans-serif";
      ctx.fillText(`Player ${roomba.playerNum}`, roomba.cX, roomba.cY + 20);
    }
  }
  // If the game is over
  else if(gameState === 'end') {
    updateColor();
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 37);
    
    ctx.font = "28px sans-serif";
    ctx.fillText(`You took x place`, canvas.width / 2, canvas.height / 2);
    
    // This text transitions between two colors
    ctx.fillStyle = `rgb(${redVal}, ${greenVal}, 0)`;
    ctx.fillText('Press Spacebar', canvas.width / 2, canvas.height / 2 + 52);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.strokeText('Press Spacebar', canvas.width / 2, canvas.height / 2 + 52);
    ctx.fillStyle = `rgb(${redVal}, ${greenVal}, 0)`;
    ctx.fillText('to Return to Start', canvas.width / 2, canvas.height / 2 + 82);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.strokeText('to Return to Start', canvas.width / 2, canvas.height / 2 + 82);
  }
  
  requestAnimationFrame(redraw);
};