import fetch from 'cross-fetch'

export function retrieveAllMyPurchaseOrders(token) {
	return dispatch => {
		return fetch('http://localhost:3001/purchaseorders/userLookup/', {
			headers: {
				'Content/Type': 'application-json'
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receivePurchaseOrders(json)))
		.catch(err => console.log(err))

	}
}

export function retrieveAllMySalesOrders(token) {
	return dispatch => {
		return fetch('http://localhost:3001/sellorders/userLookup/',{
			headers: {
				'Content/Type': 'application-json'
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveShippingOrders(json)))
		.catch(err => console.log(err))
	}
}

function receivePurchaseOrders(purchaseOrders){
	return {
		type: 'RECEIVE_PURCHASE_ORDERS'
	}
}

function receiveShippingOrders(shippingOrders){
	return {
		type: 'RECEIVE_SHIPPING_ORDERS'
	}
}