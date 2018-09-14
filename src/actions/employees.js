

function receiveLoggedUsers(loggedUsers) {
	console.log(loggedUsers)
	return {
		type:'RECEIVE_LOGGED_USERS',
		loggedUsers
	}
}

export function fetchLoggedUsers(token) {
	return dispatch => {
		return fetch('/storeconfig', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.errorText))
		.then(json => {
			dispatch(receiveLoggedUsers(json))
		})
		.catch(err => { console.log(err) })
	}
}