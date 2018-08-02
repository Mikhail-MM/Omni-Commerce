import { push } from 'react-router-redux'
import { groupBy } from 'underscore'

function organizeTicketsByStatus(ArrayOfAllTicketObjects) {

	const categorizedTicketsByStatus = groupBy(ArrayOfAllTicketObjects, 'status');
	console.log(categorizedTicketsByStatus);
	return {
		type: 'RECEIVE_TICKETS',
		categorizedTicketsByStatus
	}
}

export function fetchTickets(token) {
	return dispatch => {
		return fetch('http://localhost:3001/transactions', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(organizeTicketsByStatus(json)))
		.catch(err => console.log(err))
	}
}