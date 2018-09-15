const sio = require('socket.io')
let io;

exports.io = () => {
	return io
}

exports.initialize = (server) => {
	console.log("initializing polling from socket")
	io = sio(server, { origins: 'https://still-beach-13809.herokuapp.com/'})

	io.on('connection', (client) => {
		console.log("User Connected.")
		client.on('disconnect', () => {
			console.log("A user disconnected.")
		})
	})
}