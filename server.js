const Launchpad = require('launchpad-mini'),
	pad = new Launchpad();

const http = require('http')
const express = require('express')
const app = express()
app.use(express.static('public'))

app.set('port', '3000')

const server = http.createServer(app)
server.on('listening', () => {
	console.log('Listening on port 3000')
})

server.listen('3000')
const io = require('socket.io')(server);

// const pub = require('socket.io-client')('https://lp.rohbot.cc');
// pub.on('connect', function(){
// 	console.log('Connected to https://lp.rohbot.cc')
// });
// pub.on('launchpad:out', function(k){
// 	console.log("received",k)
// 	keys[k.y][k.x] = k.val;
// 	pad.col( keys[k.y][k.x] ? pad.red : pad.off, [[k.x,k.y]]);
// 	let msg = { x : k.x, y: k.y, val: keys[k.y][k.x] } 
// 	io.emit('launchpad:out', msg); 
// });
// pub.on('disconnect', function(){});

let board;
let next;
let prev;
const rows = 8;
const columns = 8;
function setup() {
	board = new Array(columns);
	for (let i = 0; i < columns; i++) {
		board[i] = new Array(rows);
	}
	// Going to use multiple 2D arrays and swap them
	next = new Array(columns);
	for (i = 0; i < columns; i++) {
		next[i] = new Array(rows);
	}
	init_grid();
}

function init_grid() {
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			// Lining the edges with 0s
			if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1) board[i][j] = 0;
			// Filling the rest randomly
			else board[i][j] = Math.floor(Math.random() * 2);
			next[i][j] = 0;
		}
	}
}
setup();

function display_grid() {
	io.emit('launchpad:grid', board)
	// console.log(board)
	pad.reset();
	let leds = [];
	for (let y = 0; y < columns; y++) {
		for (let x = 0; x < rows; x++) {
			if (board[y][x]) {
				leds.push([x, y])
			}
		}
	}
	// console.log(leds)
	if (leds.length)
		pad.col(pad.red, leds)
	else  // reset reset if no leds
		init_grid()
}

function check_grid() {
	// console.log('checking grid')
	// Loop through every spot in our 2D array and check spots neighbors
	for (let x = 1; x < columns - 1; x++) {
		for (let y = 1; y < rows - 1; y++) {
			// Add up all the states in a 3x3 surrounding grid
			let neighbors = 0;
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					neighbors += board[x + i][y + j];
				}
			}

			// A little trick to subtract the current cell's state since
			// we added it in the above loop
			neighbors -= board[x][y];
			// Rules of Life
			if ((board[x][y] == 1) && (neighbors < 2)) next[x][y] = 0;           // Loneliness
			else if ((board[x][y] == 1) && (neighbors > 3)) next[x][y] = 0;           // Overpopulation
			else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1;           // Reproduction
			else next[x][y] = board[x][y]; // Stasis
		}
	}

	// Swap!
	let same = true;
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			if(board[i][j] != next[i][j]){
					same = false;
			}
		}
	}

	if(same){
		init_grid();
	}

	prev = board;
	board = next;
	next = prev;


	display_grid();
}



function key_pressed(x, y) {
	console.log('key pressed', x, y)
	if (y < 8) {
		board[y][x] = !board[y][x];
		pad.col(board[y][x] ? pad.red : pad.off, [[x, y]]);
		let msg = { x: x, y: y, val: board[y][x] }
		io.emit('launchpad:out', msg);
	}
}

setInterval(check_grid, 1000);

io.sockets.on('connection', (socket) => {
	console.log('Client connected: ' + socket.id)

	socket.on('getGrid', (data) => {
		console.log('getGrid')
		io.emit('launchpad:grid', board)
	})

	socket.on('pressed', (k) => {
		console.log('pressed', k);
		key_pressed(k.x, k.y)
		//pub.emi('pressed', msg); 
	})
	socket.on('disconnect', () => console.log('Client has disconnected'))

})


pad.connect().then(() => {
	pad.reset();
	display_grid();
	// io.emit('launchpad:reset', 'reset');
	pad.col(pad.green, [8, 0]);

	pad.on('key', k => {
		//pad.reset( 2 );
		if (k.pressed) {
			key_pressed(k.x, k.y)
			// keys[k.y][k.x] = !keys[k.y][k.x];
			// console.log(k.x, k.y, k.pressed, keys[k.y][k.x]);
			// pad.col(keys[k.y][k.x] ? pad.red : pad.off, k);
			// let msg = { x: k.x, y: k.y, val: keys[k.y][k.x] }
			// io.emit('launchpad:out', msg);
			//pub.emit('pressed', msg); 
		}

		if (k.x == 8 && k.y == 7 && k.pressed) {
			console.log('reset');
			pad.reset();
			// io.emit('launchpad:reset', 'reset');
			init_grid()
			// board = grid;
		}
		if (k.x == 8 && k.y == 7 && k.pressed) {

		}


	});
});



// function get_neighbours(x, y) {
// 	let neighbours = 0;
// 	if (x - 1 >= 0 && y - 1 >= 0 && x - 1 < ROWS && y - 1 < COLS)
// 		if (keys[x - 1][y - 1])
// 			neighbours += 1;

// 	if (x >= 0 && y - 1 >= 0 && x < ROWS && y - 1 < COLS)
// 		if (keys[x][y - 1])
// 			neighbours += 1;
// 	if (x + 1 >= 0 && y - 1 >= 0 && x + 1 < ROWS && y - 1 < COLS)
// 		if (keys[x + 1][y - 1])
// 			neighbours += 1;

// 	if (x - 1 >= 0 && y >= 0 && x - 1 < ROWS && y < COLS)
// 		if (keys[x - 1][y])
// 			neighbours += 1
// 	if (x + 1 >= 0 && y >= 0 && x + 1 < ROWS && y < COLS)
// 		if (keys[x + 1][y])
// 			neighbours += 1

// 	if (x - 1 >= 0 && y + 1 >= 0 && x - 1 < ROWS && y + 1 < COLS)
// 		if (keys[x - 1][y + 1])
// 			neighbours += 1
// 	if (x >= 0 && y + 1 >= 0 && x < ROWS && y + 1 < COLS)
// 		if (keys[x][y + 1])
// 			neighbours += 1
// 	if (x + 1 >= 0 && y + 1 >= 0 && x + 1 < ROWS && y + 1 < COLS)
// 		if (keys[x + 1][y + 1])
// 			neighbours += 1
// 	return neighbours
// }