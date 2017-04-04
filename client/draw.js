const lerp = (v0, v1, alpha) => {
  return (1 - alpha) * v0 + alpha * v1;
};

const redraw = (time) => {
  updatePosition();
  
  ctx.drawImage(arenaImage, 0, 0);
  
  const keys = Object.keys(roombas);
  
  for(let i = 0; i < keys.length; i++) {
    const roomba = roombas[keys[i]];
    
    if(roomba.alpha < 1) {
      roomba.alpha += 0.05;
    }
    
    roomba.x = lerp(roomba.prevX, roomba.destX, roomba.alpha);
    roomba.y = lerp(roomba.prevY, roomba.destY, roomba.alpha);
    
    ctx.drawImage(roombaAvatar, roomba.x, roomba.y);
  }
  
  requestAnimationFrame(redraw);
}