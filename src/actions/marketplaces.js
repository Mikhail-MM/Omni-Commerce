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
export function retreiveMarketplaceById(marketplace_Id) {
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
		return fetch('url, {
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
		type: 'RECEIVE_MARKETPLACE_GOODS'
		items
	}
}