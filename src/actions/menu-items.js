import fetch from 'cross-fetch'
import { push } from 'react-router-redux'
import { groupBy } from 'underscore'

import { showModal } from './modals'

function organizeItemsToCategories(ArrayOfAllMenuItemObjects) {
	
	const categorizedMenuItems = groupBy(ArrayOfAllMenuItemObjects, 'category');
	return {
			type: 'RECEIVE_MENU_ITEMS',
			categorizedMenuItems
	}

}

function receiveMenuItemFocus(menuItem) {
	return{
		type: 'FOCUS_MENU_ITEM',
		menuItem
	}
}

export function fetchMenuItemByIdToModify(token, item_id) {
	const url = 'http://localhost:3001/menus/' + item_id 
	return dispatch => {
		return fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'GET',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : console.log(response.statusText))
		.then(json => {
			dispatch(receiveMenuItemFocus(json))
			dispatch(showModal('MODIFY_ITEM_FORM_MODAL', {}))
		})
		.catch(err => console.log(err)) 
	}
}

export function updateMenuItemProperties(token, item_id, newProps) {
	const url = 'http://localhost:3001/menus/' + item_id
	return dispatch => {
		return fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'PUT',
			mode: 'cors',
			body: JSON.stringify(newProps),
		})
		.then(response => response.ok ? response.json() : console.log(response.statusText))
		.then(json => {
			dispatch(receiveMenuItemFocus(json))
		})
		.catch(err => console.log(err))
	}
}

export function createNewMenuItem(token, data, imageFile) {
	return dispatch => {
		return fetch('http://localhost:3001/menus', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
				method: 'POST',
				mode: 'cors',
				body: JSON.stringify(data),
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(newMenuItemJSON => {

			console.log("New Item JSON data", newMenuItemJSON)
			
			const formData = new FormData()

			formData.append('menuItems', imageFile) 
			
			dispatch(fetchMenuItems(token))

			fetch('http://localhost:3001/images/marketplace-item', {
					method: 'POST',
					mode: 'cors',
					body: formData
				})
				.then(response => response.ok ? response.json() : console.log(response))
				.then(imageJSON => {
					
					console.log("Receive image metadata")
					console.log(imageJSON)

					const updatedImageSourceJSON = { imageURL: imageJSON.imageURL }

					const url = 'http://localhost:3001/menus/' +  newMenuItemJSON._id
					return fetch(url, {
						headers: {
							'Content-Type': 'application/json',
							'x-access-token': token,
						},
						method: 'PUT',
						mode: 'cors',
						body: JSON.stringify(updatedImageSourceJSON)
					})
					.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
					.then(newItemJSONWithImageURL => {
						console.log(newItemJSONWithImageURL)
						dispatch(fetchMenuItems(token))
					})
				})
		})
		.catch(err => console.log(err))
	}
}
// Need to pass in a TOKEN!
export function fetchMenuItems(token) {
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
			.then(response => response.ok ? response.json() : new Error(response.statusText))
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
		.then(response => response.ok ? response.json() : new Error(response.statusText))
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


