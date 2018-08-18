import { showModal } from './modals'

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
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			if (json.message) { return new Error(json.message) }
			dispatch(receiveShoppingCart(json))})
		.catch(err => console.log(err))
	}
}

export function pushItemIntoShoppingCart(token, itemId, amountRequested, amountAlreadyInCart) {
	const url = 'http://localhost:3001/storeItem/' + itemId

	console.log("amountRequested, ammountAlreadyInCart: ", amountRequested, amountAlreadyInCart)

	return dispatch => {
		fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
				const { itemName, numberInStock, itemPrice } = json
				console.log("Merchant SKU: ", numberInStock)

			if (amountAlreadyInCart + amountRequested > json.numberInStock) {
				console.log("Setting cart quantity to max SKU fulfillable by merchant")

				const amountThatCanBeFulfilled = json.numberInStock - amountAlreadyInCart
				const unfulfillable = amountRequested - amountThatCanBeFulfilled

				console.log("amountThatCanBeFulfilled, # of item which can not be added:", amountThatCanBeFulfilled, unfulfillable)

				if (amountThatCanBeFulfilled > 0) {
					console.log("Filling cart with partial request")
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
						postedBy: json.postedBy,
						numberRequested: amountThatCanBeFulfilled,
						sellerRef_id: json.sellerRef_id,
						marketplaceRef_id: json.marketplaceRef_id,
						itemRef_id: json._id,
					}),
				})
				.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
				.then(pushedCart => {
					console.log("Updating client's shopping cart with updated version")
					dispatch(receiveShoppingCart(pushedCart))

					const unfulfillableObject = {
						itemName,
						itemPrice,
						numberRequested: amountRequested,
						unfulfillableStock: unfulfillable,
					}
					
					json.unfulfillableStock = unfulfillable

					dispatch(receiveInvalidatedShoppingCartItems(unfulfillableObject))
					dispatch(showModal('CART_INVALIDATION_MODAL', {}))

				})
				.catch(err => console.log(err))
				} else if (amountThatCanBeFulfilled <= 0) {

					const unfulfillableStock = amountRequested
					const unfulfillableObject = {
						itemName,
						itemPrice,
						numberRequested: amountRequested,
						unfulfillableStock: unfulfillable,
					}
					dispatch(receiveInvalidatedShoppingCartItems(unfulfillableObject))
					dispatch(showModal('CART_INVALIDATION_MODAL', {}))
				}

			} else if ( amountAlreadyInCart + amountRequested <= json.numberInStock ){
				console.log("If statement running: Item DB is greater than or equal to amount requested + amount already in cart")
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
						postedBy: json.postedBy,
					}),
				})
				.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
				.then(cartJson =>{ 
					console.log("WHERE IS THE NAME", json)
					dispatch(showModal('CART_ADDITION_SUCCESS_MODAL', { itemName: json.itemName }))
					dispatch(receiveShoppingCart(cartJson)) 
				})
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
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json =>{
			if (json.partialValidationFail) { 
				
				dispatch(receiveInvalidatedShoppingCartItems(json.failedItems))
				dispatch(receiveShoppingCart(json.validatedCart))
				dispatch(showModal('CART_INVALIDATION_MODAL', {}))
			
			} else if (!json.partialValidationFail) {
				
				dispatch(receiveShoppingCart(json.validatedCart))
				dispatch(showModal('ONLINE_STORE_STRIPE_CHECKOUT', {}))
			  
			  }	
		})
		.catch(err => console.log(err))
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
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
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
	return {
	type: 'DISREGARD_INVALIDATION',
	notifyUserOfCartInvalidation: false,
	invalidatedItems: null
	}
}