export function getUserMetadata(userID) {
	return fetch(url, {
		headers:{
			'Content-Type': 'application/json',
			'x-user-type': 'Essos'
		},
		method: 'GET',
		mode: 'cors', 
	})
}