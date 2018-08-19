import io from 'socket.io-client'

const socket = io('http://localhost:3001')

export const subscribeToFeedUpdates = (cb) => {
	console.log('Callback Received:', cb)
	socket.on('getevent', eventObject => {
		console.log("Client Socket Receiving event update...", eventObject)
		cb(eventObject)
	})
}

export const closeConnection = () => {
	return socket.close()
}