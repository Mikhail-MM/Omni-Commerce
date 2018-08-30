const sio = require('socket.io')
let io;

exports.io = () => {
	return io
}

exports.initialize = (server) => {
	io = sio(server, { origins: '*:*'})

	io.on('connection', (client) => {
		console.log("User Connected.")
		client.on('disconnect', () => {
			console.log("A user disconnected.")
		})
	})
}