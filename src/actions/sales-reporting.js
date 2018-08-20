import { showModal } from './modals'

export function fetchAllTicketsAndGenerateSalesReport(token) {
	return dispatch => {
		return fetch('http://localhost:3001/salesReports', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'POST',
			mode: 'cors',
			body:JSON.stringify({})
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			dispatch(receiveSalesReport(json))
			dispatch(showModal('END_OF_BUSINESS_DAY_SUCCESS', {}))
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