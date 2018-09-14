import { showModal, hideModal } from './modals'
import { hostURI } from '../components/config'
export function retrieveAllItemsForSale() {
	console.log("We need to get some items!!!")
	return dispatch => {	
		return fetch(`${hostURI}/storeItem`, {
			headers:{
				'Content-Type': 'application/json',
			},
			method: 'GET',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			console.log("Data...: ", json)
			dispatch(receiveItems(json))
		})
		.catch(err => console.log(err))
	}
}

export function updateMarketplaceItem(token, itemID, data, imageHandler) {
	console.log("Updating Marketplace Item - What is Image handler? ", imageHandler)
	return dispatch => {
		return fetch(`/storeItem/${itemID}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'PUT',
			body: JSON.stringify(data)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			if (imageHandler.newImageFlag) {
				return fetch(`/sign-s3?fileName=${imageHandler.imageSource.name}&fileType=${imageHandler.imageSource.type}`, {
					method: 'GET',
				})
				.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
				.then(signedRequestJSON => {
					const { signedRequest, fileOnBucketurl } = signedRequestJSON
					return fetch(signedRequest, {
						headers: {
							'Origin': 'https://still-beach-13809.herokuapp.com/',
						},
						method: 'PUT', 
						body: imageHandler.imageSource,
						mode: 'cors',
					})
					.then(response =>{
						if (!response.ok) Promise.reject(response.statusText)
							return fileOnBucketurl
					})
					.then(persistedBucketURL => {
						return fetch(`/storeItem/${itemID}`, {
							headers: {
								'Content-Type': 'application/json',
								'x-access-token': token,
							},	
							method: 'PUT',
							body: JSON.stringify({ imageURL: persistedBucketURL })				
						})
						.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
						.then(modifiedItemJSONWithImageURL => {
							console.log("Modified Item w/ New Image:", modifiedItemJSONWithImageURL)
							dispatch(retrieveAllItemsForSale())
							dispatch(showModal('SHOW_ITEM_UPLOAD_SUCCESS_MODAL', {...modifiedItemJSONWithImageURL}))
						})
					})
				})
			} else if (!imageHandler.newImageFlag) {
				console.log("No new image uploaded")
				console.log("Fetching all DB items")
				dispatch(retrieveAllItemsForSale())
				dispatch(showModal('SHOW_ITEM_UPLOAD_SUCCESS_MODAL', {...json}))
			}
		})
		.catch(err => console.log(err))
	}
}

export function postEssosItem(token, data, imageFile) {
	return dispatch => {
		return fetch('/storeItem', {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'POST',
			body: JSON.stringify(data)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(newItemJSON => {
			return fetch(`/sign-s3?fileName=${imageFile.name}&fileType=${imageFile.type}`, {
				method: 'GET',
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(signedRequestJSON => {
				// Upload image to S3
				const { signedRequest, fileOnBucketurl } = signedRequestJSON
				return fetch(signedRequest, {
					headers: {
						// Use empty string because S3 expects Origin Header
						'Origin': 'https://still-beach-13809.herokuapp.com/',
					},
					method: 'PUT', 
					body: imageFile,
					mode: 'cors',
				})
				.then(response =>{
					console.log(response)
					if (!response.ok) Promise.reject(response.statusText)
						return fileOnBucketurl
				})
				.then(persistedBucketURL => {
					console.log(persistedBucketURL)
					return fetch(`/storeItem/${newItemJSON._id}`, {
						headers: {
							'Content-Type': 'application/json',
							'x-access-token': token,
						},
						method: 'PUT',
						body: JSON.stringify({imageURL: persistedBucketURL}),
					})
					.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
					.then(newItemJSONWithImageURL => {
					console.log("New item uploaded to marketplace:", newItemJSONWithImageURL)
					dispatch(retrieveAllItemsForSale())
					dispatch(showModal('SHOW_ITEM_UPLOAD_SUCCESS_MODAL', {...newItemJSONWithImageURL}))
					})
				})	
			})
		})
		.catch(err => console.log(err))
	}
}

export function deleteMarketplaceItem(token, itemID) {
	return dispatch => {
		return fetch(`/storeItem/${itemID}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'DELETE',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(deletedItem => {
			console.log("Deleted Item")
			dispatch(retrieveAllItemsForSale())
			dispatch(hideModal())
		})
		.catch(err => console.log(err))
	}
}

export function addItemToWishlist(token, itemId, mode) {
	return dispatch => {
		const controllerMode = { mode }
		return fetch(`/storeItem/wishlist/${itemId}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,			
			},
			method: 'PUT',
			body: JSON.stringify(controllerMode)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			console.log(json)
			dispatch(receiveWishlist(json))})
		.catch(err => console.log(err))
	}
}

export function getUserWishlist(token) {
	return dispatch => {
		return fetch(`/storeItem/wishlist`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,			
			},
			method: 'GET',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveWishlist(json)))
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

function receiveWishlist(wishlist) {
	return{
		type: 'RECEIVE_WISHLIST',
		wishlist
	}
}
