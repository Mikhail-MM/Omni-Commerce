import fetch from 'cross-fetch'
import { showError } from './errors'

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

function receiveLoggedUsers(loggedUsers) {
	console.log(loggedUsers)
	return {
		type:'RECEIVE_LOGGED_USERS',
		loggedUsers
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
		.then(json => dispatch(authSuccess(json)))
		.catch(err => dispatch(authFail(err)))
	}

}

// Error Upon Initial Start with New StoreConfig - When there is not a storeConfig yet, as nobody has started, we get a null return. We should create an empty storeConfig when the Master is Created
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
		.then(json => dispatch(receiveLoggedUsers(json)))
		.catch(err => console.log(err))
	}
}

