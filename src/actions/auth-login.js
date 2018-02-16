import fetch from 'cross-fetch'
import { showError } from './errors'
import { routeUserToModule } from './routing'

function throwError(errorMessage) { throw new Error(errorMessage) }

function authSuccess (userInfo) {
	console.log(userInfo)
	return {
	type:'USER_AUTHENTICATED',
	userInfo
	}

} 

function authFail (err) {
	return {
	type: 'INVALID_CREDENTIALS',
	errorText: err,
	}
}


export function logOut() {
	return {
	type: 'LOG_OUT'
	}
}

export function attemptLogIn(credentials) {
	return dispatch => {
		return fetch('http://localhost:3001/authorize', {
		headers:{
			'Content-Type': 'application/json'
		},
		method: 'POST',
		mode: 'cors', 
		body: JSON.stringify(credentials)
		})
		.then(response => response.ok ? response.json() : throwError(response.statusText))
		.then(json => {
			dispatch(authSuccess(json))
			dispatch(routeUserToModule(json))
		})
		.catch(err => dispatch(authFail(err.message)))
	}

}

// Error Upon Initial Start with New StoreConfig - When there is not a storeConfig yet, as nobody has started, we get a null return. We should create an empty storeConfig when the Master is Created


