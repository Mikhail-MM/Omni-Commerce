import { showModal } from '../actions/modals'
import axios from 'axios'
// Promise.reject(response.statusText) will take to catch handlers

// Build a general util function for handling errors - pop up a global modal, or put in a marker for errorType which current components would mapStateToProps to, showing pertinent info

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

export function navigateToMarketplaceAndGrabItems(marketplaceId) {

	const url = 'http://localhost:3001/marketplace/' + marketplaceId
	console.log(marketplaceId, url)
	return dispatch => {
		fetch(url, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'GET',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => { 
			dispatch(receiveCurrentMarketplace(json))
			const url2 = 'http://localhost:3001/storeItem/marketplaceLookup/' + marketplaceId
			console.log(url2)
			return fetch(url2, {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'GET',
				mode:'cors'
			})
			.then(response => response.ok ? response.json() : new Error(response.statusText))
			.then(itemsJSON => {
				dispatch(receiveItems(itemsJSON))
			})
		})
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
export function postItemToMarketplace(token, formData) {

	// SWITCH FROM JSON TO FORM DATA ALONGSIDE IMAGE UPLOAD

	return dispatch => {
		axios({
 		url: 'http://localhost:3001/storeItem',
  		method: 'POST',
  		data: formData,
 		headers: {
    	Accept: 'application/json',
    	'Content-Type': 'multipart/form-data',
    	'x-access-token': token
  		},
  		mode: 'cors'
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => { 

			dispatch(receiveCurrentItem(json)) 
			dispatch(showModal('ADD_MARKETPLACE_ITEM_SUCCESS', {...json}))
		})
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

export function updateMarketplaceItem(token, itemId, itemdata) {
	const url = 'http://localhost:3001/storeItem/' + itemId;
	return dispatch => {
		return fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'PUT',
			mode: 'cors',
			body: JSON.stringify(itemdata)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			dispatch(receiveCurrentItem(json))
			// Pass along modifier to accept differences in Add/Update dialogs
			dispatch(showModal('ADD_MARKETPLACE_ITEM_SUCCESS', {...json}))
		})
		.catch(err => console.log(err))
	}
}

// We can abstract out this into Switch statements or just abstract out and decide whether to use amountThatCanBeFulfilled vs amountRequested
export function pushItemIntoShoppingCart(token, itemId, amountRequested, amountAlreadyInCart) {
	const url = 'http://localhost:3001/storeItem/' + itemId
	console.log("Action Creator to Push Item into Shopping Cart Triggered - Pinging Item on tap in DB")
	console.log("amountRequested:")
	console.log(amountRequested)
	console.log("amountAlreadyInCart")
	console.log(amountAlreadyInCart)
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
				console.log("Evaluating how much of item is in stock on server (json.numberInStock:")
				console.log(json.numberInStock)

			if (amountAlreadyInCart + amountRequested > json.numberInStock) {
				console.log("If statement firing: amount already in cart + amount requested exceeds stock")
				console.log("Reconciling to update cart with amount that can be fulfilled")
				const amountThatCanBeFulfilled = json.numberInStock - amountAlreadyInCart
				console.log("amountThatCanBeFulfilled:")
				console.log(amountThatCanBeFulfilled)
				console.log("Determining overflow which is unfulfillable")
				const unfulfillable = amountRequested - amountThatCanBeFulfilled
				console.log("unfulfillable:")
				console.log(unfulfillable)

				if (amountThatCanBeFulfilled > 0) {
					console.log("nested If within an if statement firing: amountThatCanBeFulfilled is greater than 0")
					console.log("This means that we can push some amount of request to cart")
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
				.then(pushedCart => {
					console.log("Updating client's shopping cart with updated version")
					dispatch(receiveShoppingCart(pushedCart))
				const unfulfillableObject = {/* create a new object by bringing down info from original fetched 'json' of item down to here */}
					console.log("Mutating original returned item from DB - attaching a field 'unfulfillableStock' to that json, to represent a version which can't be added to cart - and returning a notice of that item. best to create a whole new object instead of mutating")
					json.unfulfillableStock = unfulfillable
					dispatch(receiveInvalidatedShoppingCartItems(json))

				})
				.catch(err => console.log(err))
				} else if (amountThatCanBeFulfilled <= 0) {
					console.log("nested else if within an if statement runs only run if AmountThatCanBeFulfilled is <= 0")
					console.log("it would be better if we did not mutate the original returned json")
					console.log("json.unfulFillable Stock being set to amountRequested")
					console.log("amountRequested:")
					console.log(amountRequested)
					json.unfulfillableStock = amountRequested
					console.log("json.unfulfillableStock")
					console.log(json.unfulfillableStock)
					console.log("dispatching invalidated cart receipt")
					dispatch(receiveInvalidatedShoppingCartItems(json))

				}

			} else if ( amountAlreadyInCart + amountRequested <= json.numberInStock ){
				console.log("If statmenet running: Item DB is greater than or equal to amount requested + amount already in cart")
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
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(receiveShoppingCart(json)))
		.catch(err => console.log(err))
	}
}

export function retrieveMyPurchaseOrders(token) {
	return dispatch => {
		return fetch('http://localhost:3001/purchaseorders/userLookup/', {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'GET',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receivePurchaseOrders(json)))
		.catch(err => console.log(err))
	}
}

export function retrieveMyShippingOrders(token) {
	return dispatch => {
		return fetch('http://localhost:3001/sellorders/userLookup/', {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'GET',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveShippingOrders(json)))
		.catch(err => console.log(err))	
	}
}

function receivePurchaseOrders(purchaseOrders) {
	return {
		type: 'RECEIVE_PURCHASE_ORDERS',
		purchaseOrders
	}
}

function receiveShippingOrders(shippingOrders) {
	return {
		type: 'RECEIVE_SHIPPING_ORDERS',
		shippingOrders
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

export function promiseTest() {
return dispatch =>{	
	return fetch('http://localhost:3001/test', {
			headers:{
				'Content-Type': 'application/json',
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => console.log(json))
		.catch(err => console.log(err))
	}
}