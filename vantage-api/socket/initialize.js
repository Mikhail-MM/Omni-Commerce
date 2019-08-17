const sio = require('socket.io')
let io;

exports.io = () => {
	return io
}

exports.initialize = (server) => {
	io = sio(server, { 
		origins: '*:*',
	})

	io.on('connection', (client) => {
		console.log("User Connected.")
		client.on('disconnect', () => {
			console.log("A user disconnected.")
		})
	})
}

/*  An interesting option, currently undoccumented in the SocketIO docs 
	https://github.com/socketio/socket.io-client/issues/1140#issuecomment-325958737
*/