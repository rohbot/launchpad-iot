let socket
let cv
let boxSize;
let MODE = 'demo';
let headerSize = 25;
let keys = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  textSize(headerSize *0.5);
  
  if ((windowHeight - headerSize) > windowWidth) {
    boxSize = (windowWidth ) / 8;
  } else {
    boxSize = (windowHeight - headerSize) / 8;
  }

  socket = io();
  socket.on('launchpad:out', function (msg) {
    console.log(msg);
    keys[msg.y][msg.x] = msg.val;
    drawGrid();
  });

  socket.on('launchpad:grid', function (grid) {
    console.log("new grid");
    keys = grid
    drawGrid();
  });

  socket.on('launchpad:mode', function (mode) {
    console.log(mode);
    MODE = mode;
    drawGrid();
  });


  socket.on('launchpad:reset', function (msg) {
    console.log(msg);
    for (let j = 0; j < 8; j++) {
      for (let i = 0; i < 8; i++) {
        keys[j][i] = 0;
      }
    }
    drawGrid();
  });
  drawGrid();
  socket.emit('getGrid', 'getGrid');
}

function mouseClicked() {
  let boxX = Math.floor(mouseX / boxSize);
  let boxY = Math.floor(mouseY / boxSize);
  if (boxX >= 0 && boxX < 8 && boxY >= 0 && boxY < 8) {
    console.log(boxX, boxY);
    socket.emit('pressed', { x: boxX, y: boxY })

  }

}

function drawGrid() {

  clear();
  fill(0)
  text('Mode: ' + MODE, 3, 10);

  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 8; i++) {
      if (keys[j][i]) {
        fill(255, 0, 0);
      } else {
        fill(255);
      }

      rect(i * boxSize, (j * boxSize) + headerSize, boxSize, boxSize);
    }
  }
  

}