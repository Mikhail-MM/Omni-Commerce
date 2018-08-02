function throwError(errorMessage) { throw new Error(errorMessage) }

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
		.then(response => response.ok ? response.json() : throwError("Error"))
		.then(json => {
			if (json === null) return console.log("No users currently logged in")
			dispatch(receiveLoggedUsers(json))
		})
		.catch(err => console.log(err))
	}
}