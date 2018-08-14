export function fetchAllTicketsAndGenerateSalesReport(token) {
	return dispatch => {
		// Retrieve all transactions bound to organizational MongoCollectionKey on Backend

		// Interestingly, none of these transactions will be available to be edited after they are aggregated. We can add the ability to modify them
		// We may want to collect any unterminated tickets (Which have not been voided or paid) for further processing and to ensure that operator did not miss them accidentally
		return fetch('http://localhost:3001/transactions', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			console.log("Sending Aggregate Transactions to Server:")
			console.log(json)
			return fetch('http://localhost:3001/salesReports', {
				headers:{
					'Content-Type': 'application/json',
					'x-access-token': token
				},
				method: 'POST',
				mode: 'cors',
				body:JSON.stringify(json)
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => dispatch(receiveSalesReport(json)))
		})
		.catch(err => console.log(err))
	}
}

export function lookUpSalesReportsByDate(token, beginDate, endDate) {
	console.log("Dispatch LookUpSalesReportsByDate Firing")
	const data = { beginDate: beginDate._d, endDate: endDate._d }
	console.log(data.beginDate)
	console.log(data.endDate)
	return dispatch => {
		return fetch('http://localhost:3001/salesReports/aggregate/', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify(data)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveSalesReport(json)))
		.catch(err => console.log(err))
	}
}

export function receiveSalesReport(salesReport) {
	return {
		type: 'RECEIVE_SALES_REPORT',
		salesReport
	}
}