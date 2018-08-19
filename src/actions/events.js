export const getAllEvents = (token) => {
		return fetch('http://localhost:3001/events', {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			console.log("Received Events: ", json)
			return json
		})
}

