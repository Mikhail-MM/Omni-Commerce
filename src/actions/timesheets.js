import { fetchLoggedUsers } from './employees'

export function clockEmployeeOut(token, employeeNumber) {
	const data = {clockInNumber: employeeNumber}
	return dispatch => {
		return fetch('http://localhost:3001/timesheets/co', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			body: JSON.stringify(data),
			method: 'PUT',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			console.log("User Clocked Out - Returning Timesheet:")
			console.log(json)
			return dispatch(fetchLoggedUsers(token))}) // Dispatch action to Redux Store informing Client of array of currently clocked in users to enter orders. Analyze Populated Query
	}
}

// To Avoid multiple fetches to Request Logged Users - we need to go into the middleware chain and return an OBJECT containing the New Timesheet AND the array of logged in users - both of which are constructed in the middleware chain which fires when we insert a Clock In/Out Request. From there, this should dispatch receive logged users AND maybe a display timesheet thing
export function clockEmployeeIn(token, employeeNumber) {
	console.log("Clock-In Action Dispatched. Sending Credentials")
	console.log("Token: ")
	console.log(token)
	console.log("Employee Number: ")
	console.log(employeeNumber)
	const data = {clockInNumber: employeeNumber}
	console.log("Data to Stringify: ")
	console.log(data)
	return dispatch => {
		return fetch('http://localhost:3001/timesheets/ci', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify(data),
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			console.log("User Clocked In - Returning Timesheet:")
			console.log(json)
			dispatch(fetchLoggedUsers(token))}) // Dispatch action to Redux Store informing Client of array of currently clocked in users to enter orders. Analyze Populated Query
	}
}