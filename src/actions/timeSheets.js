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
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => console.log(json)) // Dispatch action to Redux Store informing Client of array of currently clocked in users to enter orders. Analyze Populated Query
	}
}

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
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => console.log(json)) // Dispatch action to Redux Store informing Client of array of currently clocked in users to enter orders. Analyze Populated Query
	}
}