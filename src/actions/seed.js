export function seedOmniDatabase() {
	return dispatch => {
		return fetch('/seed/omni/', {
		headers:{
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({})
		}) 
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => console.log(json))
	}
}

export function seedEssosMarketplace() {
	return dispatch => {
		return fetch('/seed/essos/', {
		headers:{
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({})
		}) 
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => console.log(json))
	}
}

export function seedEssosJumbotron() {
	return dispatch => {
		return fetch('/seed/jumbo', {
			headers:{
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({})
		}) 
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => console.log(json))
	}
}