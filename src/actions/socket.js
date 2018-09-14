import io from 'socket.io-client'

const socket = io('https://still-beach-13809.herokuapp.com/')

export const subscribeToFeedUpdates = (token, cb) => {
	fetch(`/users/essos/getProfileView/ownProfile`, {
		headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
				'x-user-pathway': 'Omni',
				},
			method: 'GET',
	})
	.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
	.then(userData => {
		const keyedEvent = `getEvent_${userData.mongoCollectionKey}`
		console.log("Connected to event feed:", keyedEvent)
		socket.on(keyedEvent, eventObject => {
			console.log("Client Socket Receiving event update...", eventObject)
			cb(eventObject)
		})
	})
	.catch(err => console.log(err))
}

export const closeConnection = () => {
	return socket.close()
}