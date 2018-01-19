import fetch from 'cross-fetch'
import { push } from 'react-router-redux'
import { groupBy } from 'underscore'

function organizeItemsToCategories(ArrayOfAllMenuItemObjects) {
	
	const categorizedMenuItems = groupBy(ArrayOfAllMenuItemObjects, 'category');
	console.log(categorizedMenuItems); // Comment out Later
	return {
	type: 'RECEIVE_MENU_ITEMS',
	categorizedMenuItems
	}

}
export function createNewMenuItem(token, data) {
	return dispatch => {
		return fetch('http://localhost:3001/menus', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
				method: 'POST',
				mode: 'cors',
				body: data,
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(fetchMenuItems(token)))
		.catch(err => console.log(err))
	}
}
// Need to pass in a TOKEN!
export function fetchMenuItems(token) {
	console.log("Looking for Employee Token within fetchMenuItems action")
	console.log(token)
	return dispatch => {
		return fetch('http://localhost:3001/menus', {
			headers:{ 
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors',
		})
		// fix this method
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(organizeItemsToCategories(json)))
		.catch(err => console.log(err)) 
	}
}

// We can abstract out the organizing part from the action - note that we have repeated code between fetchTickets and fetchAllTicketsAndGenerateSalesReport
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

export function fetchAllTicketsAndGenerateSalesReport(token) {
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
		.then(json => {
			const data = {
				arrayOfAllTickets: json,
				arrayOfAllTicketsByStatus: groupBy(json, 'status'),
			}
			console.log("Sending Aggregate and Sorted Transactions to Server:")
			console.log(data)
			return fetch('http://localhost:3001/salesReports', {
				headers:{
					'Content-Type': 'application/json',
					'x-access-token': token
				},
				method: 'POST',
				mode: 'cors',
				body:JSON.stringify(data)
			})
		})
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

export function updateTransactionWithMenuItem(token, menuItem_Id, currentTransaction_Id) {
	const url = 'http://localhost:3001/menus/noIDhack/' + menuItem_Id;
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
		.then(json => {
			const url = 'http://localhost:3001/transactions/addItem/' + currentTransaction_Id;
			return fetch(url, {
				headers:{
					'Content-Type': 'application/json',
					'x-access-token': token,
				},
				method: 'PUT',
				mode: 'cors',
				body: JSON.stringify(json),
			})
			.then(response => response.ok ? response.json() : new Error(response.statusText))
			.then(json => dispatch(receiveCurrentTicket(json)))
		})
		.catch(err => console.log(err))
	}
}

export function updateTransactionWithSubdocRemoval(token, subdoc_Id, currentTransaction_Id) {
	const url = 'http://localhost:3001/transactions/removeItem/' + currentTransaction_Id
	const data = { subdoc_Id: subdoc_Id }
	return dispatch => {
		return fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'PUT',
			mode: 'cors',
			body: JSON.stringify(data),
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(receiveCurrentTicket(json)))
		.catch(err => console.log(err))
	}
}

export function updateTransactionWithRequestedAddon(token, currentTransaction_Id, addOn) {
	const url = 'http://localhost:3001/transactions/requestAddon/' + currentTransaction_Id
	return dispatch => {
		return fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'PUT',
			mode: 'cors',
			body: addOn,
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(receiveCurrentTicket(json)))
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

export function receiveCurrentTicket(ticket) {
	return {
		type: 'RECEIVE_CURRENT_TICKET',
		ticket
	}
}

export function setVisibleCategory(category) {
	return {
		type: 'SET_VISIBLE_CATEGORY',
		visibleCategory: category
	}
}