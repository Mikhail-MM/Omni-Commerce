import { showModal } from './modals'

export function retrieveAllItemsForSale() {
	return dispatch => {	
		return fetch('http://localhost:3001/storeItem', {
			headers:{
				'Content-Type': 'application/json',
			},
			method: 'GET',
			mode: 'cors'
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveItems(json)))
		.catch(err => console.log(err))
	}
}

export function updateMarketplaceItem(token, itemID, data, imageHandler) {
	return dispatch => {
		return fetch(`'http://localhost:3001/storeItem/${itemID}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'PUT',
			mode: 'cors',
			body: JSON.stringify(data)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			if (imageHandler.newImageFlag) {
				const formData = new FormData()
				formData.append('marketplaceItems', imageHandler.imageSource)
				return fetch('http://localhost:3001/images/marketplace-item', {
					method: 'POST',
					mode: 'cors',
					body: formData
				})
				.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
				.then(fileUploadResponse => {
					console.log("Receive Image Metadata", fileUploadResponse)
					const imageURLJSON = { imageURL: fileUploadResponse.imageURL} 
					return fetch(`http://localhost:3001/storeItem/${itemID}`, {
						headers: {
							'Content-Type': 'application/json',
							'x-access-token': token,
						},	
						method: 'PUT',
						mode: 'cors',
						body: JSON.stringify(imageURLJSON)				
					})
					.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
					.then(modifiedItemJSONWithImageURL => {
						console.log("Modified Item w/ New Image:", modifiedItemJSONWithImageURL)
						dispatch(retrieveAllItemsForSale())
						dispatch(showModal('SHOW_ITEM_UPLOAD_SUCCESS_MODAL', {...modifiedItemJSONWithImageURL}))
					})
				})
			} else if (imageHandler.newImageFlag === null) {
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
		return fetch('http://localhost:3001/storeItem', {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify(data)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(newItemJSON => {

			return fetch(`http://localhost:3001/sign-s3?filename=${imageFile.name}&fileType=${imageFile.type}`, {
				method: 'GET',
				mode: 'cors',
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(signedRequestJSON => {
				// Upload image to S3
				console.log(signedRequestJSON)
				const { signedRequest, fileOnBucketurl } = signedRequestJSON
				return fetch(signedRequest, {
					method: 'PUT', 
					body: imageFile
				})
				.then(response =>{
					if (!response.ok) Promise.reject(response.statusText)
						return fileOnBucketurl
				})
				.then(persistedBucketURL => {
					return fetch(`http://localhost:3001/storeItem/${newItemJSON._id}`, {
						headers: {
							'Content-Type': 'application/json',
							'x-access-token': token,
						},
						method: 'PUT',
						mode: 'cors',
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

export function addItemToWishlist(token, itemId, mode) {
	return dispatch => {
		const controllerMode = { mode }
		return fetch(`http://localhost:3001/storeItem/wishlist/${itemId}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,			
			},
			method: 'PUT',
			mode: 'cors',
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
		return fetch(`http://localhost:3001/storeItem/wishlist`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,			
			},
			method: 'GET',
			mode: 'cors',	
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
