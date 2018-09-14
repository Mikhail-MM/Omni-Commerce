import { groupBy } from 'underscore'

import { showModal, hideModal } from './modals'

function organizeItemsToCategories(ArrayOfAllMenuItemObjects) {
	
	const categorizedMenuItems = groupBy(ArrayOfAllMenuItemObjects, 'category');
	return {
			type: 'RECEIVE_MENU_ITEMS',
			categorizedMenuItems
	}

}

export function fetchMenuItems(token) {
	return dispatch => {
		return fetch('/menus', {
			headers:{ 
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(organizeItemsToCategories(json)))
		.catch(err => console.log(err)) 
	}
}

export function createNewMenuItem(token, data, imageFile) {
	return dispatch => {
		fetch('/menus', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
				method: 'POST',
				body: JSON.stringify(data),
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(newMenuItemJSON => {
			return fetch(`/sign-s3?fileName=${imageFile.name}&fileType=${imageFile.type}`, {
				method: 'GET',
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(signedRequestJSON => {
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
					return fetch(`/menus/${newMenuItemJSON._id}`, {
						headers: {
							'Content-Type': 'application/json',
							'x-access-token': token,
						},
						method: 'PUT',
						body: JSON.stringify({ imageURL: persistedBucketURL })
					})
					.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
					.then(newItemJSONWithImageURL => {
						console.log("updated item", newItemJSONWithImageURL)
						dispatch(fetchMenuItems(token))
						dispatch(showModal('SHOW_ITEM_UPLOAD_SUCCESS_MODAL', {...newItemJSONWithImageURL}))

					})
				})
			})
		})
		.catch(err => console.log(err))
	}
}

export function modifyOmniTerminalItem(token, itemID, data, imageHandler) {
	return dispatch => {
		return fetch(`/menus/${itemID}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'PUT',
			body: JSON.stringify(data),
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
						console.log(response)
						if (!response.ok) Promise.reject(response.statusText)
							return fileOnBucketurl
					})
					.then(persistedBucketURL => {
						return fetch(`/menus/${itemID}`, {
							headers: {
								'Content-Type': 'application/json',
								'x-access-token': token,
							},
							method: 'PUT',
							body: JSON.stringify({ imageURL: persistedBucketURL })
						})
						.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
						.then(newItemJSONWithImageURL => {
							console.log("updated item", newItemJSONWithImageURL)
							dispatch(fetchMenuItems(token))
							dispatch(showModal('SHOW_ITEM_UPLOAD_SUCCESS_MODAL', {...newItemJSONWithImageURL}))

						})
					})
				})
			} else if (!imageHandler.newImageFlag) {
				console.log("No Image Change. Logging new item attributes: ", json)
				console.log("Client fetching all items")
				dispatch(fetchMenuItems(token))
				dispatch(showModal('SHOW_ITEM_UPLOAD_SUCCESS_MODAL', {...json}))
			}
		})
		.catch(err => console.log(err))
	}
}

export function deleteTerminalItem(token, itemID) {
	return dispatch => {
		return fetch(`/menus/${itemID}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'DELETE',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(deletedItem => {
			console.log("Deleted Item")
			dispatch(fetchMenuItems(token))
			dispatch(hideModal())
		})
		.catch(err => console.log(err))
	}
}