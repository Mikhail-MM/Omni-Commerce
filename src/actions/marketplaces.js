// TODO: Extract Common Headers to own config
export function retrieveAllMarketplaces() {
	return dispatch => {
		return fetch('http://localhost:3001/marketplace', {
			headers:{
				'Content-Type': 'application/json'
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(receiveAllMarketplaces(json)))
		.catch(err => console.log(err))
	}
}
function receiveAllMarketplaces(allMarketplaces) {
	return {
		type: 'RECEIVE_ALL_MARKETPLACES',
		allMarketplaces
	}
}
export function retrieveMarketplaceById(marketplace_Id) {
	const url = 'http://localhost:3001/marketplace/' + marketplace_Id
	return dispatch => {
		return fetch(url, {
			headers:{
				'Content-Type': 'application/json'
			},
			method: 'GET',
			mode: 'cors'			
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(receiveCurrentMarketplace(json)))
		.catch(err => console.log(err))
	}
}

function receiveCurrentMarketplace(currentMarketplace) {
	return {
		type: 'RECEIVE_CURRENT_MARKETPLACE',
		currentMarketplace
	}
}
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

export function retrieveItemsFromMarketplace(marketplaceId) {
	const url = 'http://localhost:3001/storeItem/marketplaceLookup/' + marketplaceId
	return dispatch => {	
		return fetch(url, {
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
export function postItemToMarketplace(token, itemData) {
	return dispatch => {
		return fetch('http://localhost:3001/storeItem', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify(itemData)
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(receiveCurrentItem(json)))
		.catch(err => console.log(err))
	}
}

export function retrieveItemById(itemId) {
	const url = 'http://localhost:3001/storeItem/' + itemId
	return dispatch => {
		return fetch(url, {
			headers:{
				'Content-Type': 'application/json'
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(receiveCurrentItem(json)))
		.catch(err => console.log(err))
	}
}

export function retrieveShoppingCart(token) {
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
		.then(json => dispatch(receiveShoppingCart(json)))
		.catch(err => console.log(err))
	}
}

// We can abstract out this into Switch statements or just abstract out and decide whether to use amountThatCanBeFulfilled vs amountRequested
export function pushItemIntoShoppingCart(token, itemId, amountRequested, amountAlreadyInCart) {
	const url = 'http://localhost:3001/storeItem/' + itemId
	return dispatch => {
		fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => {
			if (amountAlreadyInCart + amountRequested > json.numberInStock) {
				console.log("Merchant does not have sufficient stock to fulfill order")
				
				const amountThatCanBeFulfilled = json.numberInStock - amountAlreadyInCart
				const unfulfillable = amountRequested - amountThatCanBeFulfilled

				if (amountThatCanBeFulfilled > 0) {
					return fetch('http://localhost:3001/shoppingCart/addItem', {
					headers:{
						'Content-Type': 'application/json',
						'x-access-token': token,
					},
					method: 'PUT',
					mode: 'cors',
					body: JSON.stringify({
						itemName: json.itemName,
						itemPrice: json.itemPrice,
						imageURL: json.imageURL,
						numberRequested: amountThatCanBeFulfilled,
						sellerRef_id: json.sellerRef_id,
						marketplaceRef_id: json.marketplaceRef_id,
						itemRef_id: json._id,
					}),
				})
				.then(response => response.ok ? response.json() : new Error(response.statusText))
				.then(json => {
					dispatch(receiveShoppingCart(json))
					json.unfulfillableStock = unfulfillable
					dispatch(receiveInvalidatedShoppingCartItems(json))

				})
				.catch(err => console.log(err))
				} else {
					// append new field for that could not go through - for multiple item scans this will be done more thoroughly on the backend - the object will be constructed with flags to be parsed by a front end invalidation component
					json.unfulfillableStock = amountRequested
					dispatch(receiveInvalidatedShoppingCartItems(json))

				}

			} else {
				return fetch('http://localhost:3001/shoppingCart/addItem', {
					headers:{
						'Content-Type': 'application/json',
						'x-access-token': token,
					},
					method: 'PUT',
					mode: 'cors',
					body: JSON.stringify({
						itemName: json.itemName,
						itemPrice: json.itemPrice,
						imageURL: json.imageURL,
						numberRequested: amountRequested,
						sellerRef_id: json.sellerRef_id,
						marketplaceRef_id: json.marketplaceRef_id,
						itemRef_id: json._id,
					}),
				})
				.then(response => response.ok ? response.json() : new Error(response.statusText))
				.then(json => dispatch(receiveShoppingCart(json)))
				.catch(err => console.log(err))
			}
		});

	}
}

export function validateCartAndProceedToPayment(token) {
	return dispatch => { // check validation, watch for flags, dispatch to payment gateway or just bring up a modal 
		fetch('http://localhost:3001/shoppingCart/checkOut/', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'POST',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json =>{
		if (json.partialValidationFail) { /* Dispatch a Invalidation Modal which consists of our Cart Invalidation Screen */ 
			/* Also dispatch reciept of our update shopping cart contents */
		}
		else if (!json.partialValidationFail) { /* We may not NEED to dispatch a receipt of a shopping cart, but it would not be the worst thing
		NOW we finally dispatch the STRIPE PAYMENT ACCEPTANCE MODAL */ }
		})
		.catch(console.log(err))
	}
	
}


export function pullItemFromCart(token, subdocId) {
	console.log("Attempting to pull boughtItem at position");
	console.log(subdocId);
	const data = { _id: subdocId }
	return dispatch => {
		fetch('http://localhost:3001/shoppingCart/removeItem/',{ 
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'PUT',
			mode: 'cors',
			body: JSON.stringify(data),
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(receiveShoppingCart(json)))
		.catch(err => console.log(err))
	}
}


function receiveShoppingCart(shoppingCart) {
	return {
		type: 'RECEIVE_SHOPPING_CART',
		shoppingCart
	}
}

function receiveInvalidatedShoppingCartItems(invalidatedItems) {
	return{
		type: 'INVALID_CART_ORDER',
		notifyUserOfCartInvalidation: true,
		invalidatedItems
	}
}

export function disregardInvalidatedItems() {
	type: 'DISREGARD_INVALIDATION',
	notifyUserOfCartInvalidation: false,
	invalidatedItems: null
}