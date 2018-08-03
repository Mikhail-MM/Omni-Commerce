export function retrieveAllItemsForSale() {
	return dispatch => {	
		return fetch('http://localhost:3001/storeItem', {
			headers:{
				'Content-Type': 'application/json',
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(receiveItems(json)))
		.catch(err => console.log(err))
	}
}

export function retrieveShoppingCart(token) {
	console.log("Sending token to server for shopping cart retrieval")
	console.log(token)
	return dispatch => {
		return fetch('http://localhost:3001/shoppingCart/userLookup/', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => {
			if (json.message) { return new Error(json.message) }
			dispatch(receiveShoppingCart(json))})
		.catch(err => console.log(err))
	}
}

function receiveItems(items) {
	return {
		type: 'RECEIVE_MARKETPLACE_GOODS',
		items
	}
}

function receiveCurrentItem(item) {
	return{
		type: 'RECEIVE_CURRENT_ITEM',
		item
	}
}

function receiveShoppingCart(shoppingCart) {
	return {
		type: 'RECEIVE_SHOPPING_CART',
		shoppingCart
	}
}