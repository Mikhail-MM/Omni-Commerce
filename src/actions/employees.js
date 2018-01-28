import {startLoading, stopLoading} from './loading'
export function fetchAllEmployees() {
	return dispatch => {
		dispatch(startLoading())
		return fetch('http://localhost:3001/clients/lookupEmployees', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET'
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