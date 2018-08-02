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

export function createNewTicket(token, createdBy) {
	const data = { createdBy: createdBy, createdAt: Date.now(), status: "Open"}
	return dispatch => {
		return fetch('http://localhost:3001/transactions', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify(data),
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => {
			dispatch(fetchTickets(token))
			dispatch(receiveCurrentTicket(json))
			dispatch(push('/ticket')) 			
			}
		)
		.catch(err => console.log(err))
	}
}

export function fetchCurrentTicketDetails(token, ticket_Id) {
	const url = 'http://localhost:3001/transactions/' + ticket_Id;
	return dispatch => {
		return fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'GET',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(receiveCurrentTicket(json)))
		.then(() => dispatch(push('/ticket')))
		.catch(err => console.log(err))
	}
}