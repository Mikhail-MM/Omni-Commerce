export function seedOmniDatabase() {
	return dispatch => {
		return fetch('http://localhost:3001/seed/omni/', {
		headers:{
			'Content-Type': 'application/json'
		},
		method: 'POST',
		mode: 'cors', 
		body: JSON.stringify({})
		}) 
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => console.log(json))
	}
}