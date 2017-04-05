let roombas = {};

const checkFall = () => {
  const keys = Object.keys(roombas);

  for (let i = 0; i < keys.length; i++) {
    const roomba = roombas[keys[i]];

    if ((roomba.position.x + roomba.radius) < 100 || (roomba.position.x + roomba.radius) > 500 ||
       (roomba.position.y + roomba.radius) < 100 || (roomba.position.y + roomba.radius) > 500) {
      // TODO - Add death logic
    }
  }
};

const checkCollision = (hash) => {
  const roomba1 = roombas[hash];
  const keys = Object.keys(roombas);

  for (let i = 0; i < keys.length; i++) {
    const roomba2 = roombas[keys[i]];
    if (roomba1 === undefined || roomba1.hash === roomba2.hash) {
      return;
    }
    const distX = roomba1.position.x - roomba2.position.x;
    const distY = roomba1.position.y - roomba2.position.y;
    const radius = roomba1.radius + roomba2.radius;
    if (((distX * distX) + (distY * distY)) <= radius * radius) {
      // TODO - Add collision logic
    }
  }
};

const setRoombaList = (roombaList) => {
  roombas = roombaList;
};

const setRoomba = (roomba) => {
  roombas[roomba.hash] = roomba;
};

setInterval(() => {
  checkFall();
}, 20);

setInterval(() => {
  const keys = Object.keys(roombas);

  for (let i = 0; i < keys.length; i++) {
    if (!(i + 2 > keys.length)) {
      const roomba1 = roombas[keys[i]];
      const roomba2 = roombas[keys[i + 1]];
      checkCollision(roomba1, roomba2);
    }
  }
}, 20);

module.exports.setRoombaList = setRoombaList;
module.exports.setRoomba = setRoomba;
module.exports.checkCollision = checkCollision;
