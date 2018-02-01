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
		return fetch('http://localhost:3001/shoppingCart/userLookup', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET'
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(receiveShoppingCart(json)))
		.catch(err => console.log(err))
	}
}

export function pushItemIntoShoppingCart(token, itemId) {
	const url = 'http://localhost:3001/storeItem/noIDhack/' + itemId
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
			return fetch('http://localhost:3001/shoppingCart/addItem', {
				headers:{
					'Content-Type': 'application/json',
					'x-access-token': token,
				},
				method: 'PUT',
				mode: 'cors',
				body: JSON.stringify(json),
			})
			.then(response => response.ok ? response.json() : new Error(response.statusText))
			.then(json => dispatch(receiveShoppingCart(json)))
			.catch(err => console.log(err))
		});
	}
}

export function pullItemFromCart(token, subdocId) {
	const url = 'http://localhost:3001/shoppingCart/removeItem',
	fetch('http://localhost:3001/shoppingCart/removeItem',{ 
		headers:{
			'Content-Type': 'application/json',
			'x-access-token': token,
		}
		method: 'PUT',
		mode: 'cors',
		body: JSON.stringify(subdocId)
	})
	.then(response => response.ok ? response.json() : new Error(response.statusText))
	.then(json => dispatch(receiveShoppingCart(json)))
	.catch(err => console.log(err))
}

function receiveShoppingCart(shoppingCart) {
	return {
		type: 'RECEIVE_SHOPPING_CART',
		shoppingCart
	}
}
