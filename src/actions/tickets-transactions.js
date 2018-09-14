import { push } from 'react-router-redux'
import { groupBy } from 'underscore'


export function receiveCurrentTicket(ticket) {
	return {
		type: 'RECEIVE_CURRENT_TICKET',
		ticket
	}
}

function organizeTicketsByStatus(ArrayOfAllTicketObjects) {

	const categorizedTicketsByStatus = groupBy(ArrayOfAllTicketObjects, 'status');
	console.log(categorizedTicketsByStatus);
	return {
		type: 'RECEIVE_TICKETS',
		categorizedTicketsByStatus
	}
}

export function setVisibleCategory(category) {
	return {
		type: 'SET_VISIBLE_CATEGORY',
		visibleCategory: category
	}
}

export function fetchTickets(token) {
	return dispatch => {
		return fetch('/transactions', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(organizeTicketsByStatus(json)))
		.catch(err => console.log(err))
	}
}

export function createNewTicket(token, createdBy) {
	const data = { createdBy: createdBy, createdAt: Date.now(), status: "Open"}
	return dispatch => {
		return fetch('/transactions', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'POST',
			body: JSON.stringify(data),
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			dispatch(fetchTickets(token))
			dispatch(receiveCurrentTicket(json))
			dispatch(push('/omni/terminal/tickets')) 			
			}
		)
		.catch(err => console.log(err))
	}
}

export function fetchCurrentTicketDetails(token, ticket_Id) {
	const url = `/transactions/${ticket_Id}`;
	return dispatch => {
		return fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'GET',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveCurrentTicket(json)))
		.then(() => dispatch(push('/omni/terminal/tickets')))
		.catch(err => console.log(err))
	}
}

export function updateTransactionWithMenuItem(token, menuItem_Id, currentTransaction_Id) {
	const url = '/menus/noIDhack/' + menuItem_Id;
	return dispatch => {
		return fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'GET',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			const url = '/transactions/addItem/' + currentTransaction_Id;
			return fetch(url, {
				headers:{
					'Content-Type': 'application/json',
					'x-access-token': token,
				},
				method: 'PUT',
				body: JSON.stringify(json),
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => dispatch(receiveCurrentTicket(json)))
		})
		.catch(err => console.log(err))
	}
}


export function updateTicketStatus(token, ticket_Id, ticketStatus) {
	const url = `/transactions/${ticket_Id}`
	const data = { status: ticketStatus }
	return dispatch => {
		return fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'PUT',
			body: JSON.stringify(data),
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveCurrentTicket(json)))
	}
}


export function updateTransactionWithRequestedAddon(token, currentTransaction_Id, addOn) {
	const url = `/transactions/requestAddon/${currentTransaction_Id}`
	return dispatch => {
		return fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'PUT',
			body: addOn,
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveCurrentTicket(json)))
		.catch(err => console.log(err))
	}
}

export function updateTransactionWithSubdocRemoval(token, subdoc_Id, currentTransaction_Id) {
	const url = `/transactions/removeItem/${currentTransaction_Id}`
	const data = { subdoc_Id: subdoc_Id }
	return dispatch => {
		return fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'PUT',
			body: JSON.stringify(data),
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveCurrentTicket(json)))
		.catch(err => console.log(err))
	}
}