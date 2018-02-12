import {startLoading, stopLoading} from './loading'

function throwError(errorMessage) { throw new Error(errorMessage) }
{/* 
export function fetchAllEmployees() {
	return dispatch => {
		dispatch(startLoading())
		return fetch('http://localhost:3001/clients/lookupEmployees', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : dispatch(showError(response.statusText)))
		.then(json => {
			dispatch(receiveEmployees(employees))
			return dispatch(stopLoading())
		})
		.catch(err => dispatch(showError(err)))
	}
}

function receiveEmployees(employees) {
	return{
		type: 'RECEIVE_EMPLOYEES',
		employees
	}
}
*/}
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

function receiveLoggedUsers(loggedUsers) {
	console.log(loggedUsers)
	return {
		type:'RECEIVE_LOGGED_USERS',
		loggedUsers
	}
}
