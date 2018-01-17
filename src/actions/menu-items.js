import fetch from 'cross-fetch'
import { groupBy } from 'underscore'

function organizeItemsToCategories(ArrayOfAllMenuItemObjects) {
	
	const categorizedMenuItems = groupBy(ArrayOfAllMenuItemObjects, 'category');
	console.log(categorizedMenuItems); // Comment out Later
	return {
	type: 'RECEIVE_MENU_ITEMS',
	categorizedMenuItems
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
		.then(json => dispatch(receiveCurrentTicket(json)))
		.catch(err => console.log(err))
	}
}

export function updateTransactionWithMenuItem(token, menuItem_Id, currentTransaction_Id) {
	const url = 'http://localhost:3001/menus/' + menuItem_Id;
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
			const url = 'http://localhost:3001/transactions/' + currentTransaction_Id;
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