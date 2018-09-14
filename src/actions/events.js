export const getAllEvents = (token) => {
		return fetch('/events', {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			console.log("Received Events: ", json)
			return json
		})
}

