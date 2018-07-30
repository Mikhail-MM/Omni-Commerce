import {startLoading, stopLoading} from './loading'

function throwError(errorMessage) { throw new Error(errorMessage) }

export function fetchAllEmployees(token) {
	console.log("looking for employees")
	console.log("token:", token)
	return dispatch => {
		// Need to make loading dispatch more reducer-specific, instead of a global loading counter. Maybe even do it within a semantic UI segment
		return fetch('http://localhost:3001/employees/find_all', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : console.log(response.statusText))
		.then(json => {
			dispatch(receiveEmployees(json))
		})
		.catch(err => console.log(err))
	}
}

function receiveEmployees(employees) {
	return{
		type: 'RECEIVE_ALL_EMPLOYEES',
		employees
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


// Can abstract out these next 2 into modifyEmployeePrivileges and export handlers like we did in the auth function
export function authorizeEmployeePrivileges(token, employeeId) {
	return dispatch => {
		return fetch('http://localhost:3001/employees/authorize', {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify({_id: employeeId})
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => console.log(json))
		.catch(err => console.log(err))
	}
}

export function invalidateEmployeePrivileges(token, employeeId) {
	return dispatch => {
		return fetch('http://localhost:3001/employees/invalidate', {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify({_id: employeeId})
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => console.log(json))
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

