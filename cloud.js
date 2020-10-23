const http = require('http')
const express = require('express')
const app = express()
app.use(express.static('public'))

app.set('port', '3000')

const server = http.createServer(app)
server.on('listening', () => {
	console.log('Listening on port http://localhost:3000')
})

server.listen('3000')
const io = require('socket.io')(server);


const grid = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
];
let keys = grid;


io.sockets.on('connection', (socket) => {
	console.log('Client connected: ' + socket.id)

	socket.on('getGrid', (data) => {
		console.log('getGrid')
		io.emit('launchpad:grid', keys)
	})

	socket.on('pressed', (k) => {
		console.log('pressed', k);
		keys[k.y][k.x] = !keys[k.y][k.x];
		let msg = { x: k.x, y: k.y, val: keys[k.y][k.x] }
		io.emit('launchpad:out', msg);
		
	})
	socket.on('disconnect', () => console.log('Client has disconnected'))
})

