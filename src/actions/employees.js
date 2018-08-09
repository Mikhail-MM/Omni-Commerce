

function receiveLoggedUsers(loggedUsers) {
	console.log(loggedUsers)
	return {
		type:'RECEIVE_LOGGED_USERS',
		loggedUsers
	}
}

export function fetchLoggedUsers(token) {
	return dispatch => {
		return fetch('http://localhost:3001/storeconfig', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.errorText))
		.then(json => {
			dispatch(receiveLoggedUsers(json))
		})
		.catch(err => { throw new Error(err) })
	}
}