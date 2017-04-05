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
}