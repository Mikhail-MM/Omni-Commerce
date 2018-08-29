import { groupBy } from 'underscore'

import { showModal } from './modals'

function organizeItemsToCategories(ArrayOfAllMenuItemObjects) {
	
	const categorizedMenuItems = groupBy(ArrayOfAllMenuItemObjects, 'category');
	return {
			type: 'RECEIVE_MENU_ITEMS',
			categorizedMenuItems
	}

}

export function fetchMenuItems(token) {
	return dispatch => {
		return fetch('http://localhost:3001/menus', {
			headers:{ 
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(organizeItemsToCategories(json)))
		.catch(err => console.log(err)) 
	}
}

export function createNewMenuItem(token, data, imageFile) {
	return dispatch => {
		fetch('http://localhost:3001/menus', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': token
			},
				method: 'POST',
				mode: 'cors',
				body: JSON.stringify(data),
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(newMenuItemJSON => {
			return fetch(`http://localhost:3001/sign-s3?fileName=${imageFile.name}&fileType=${imageFile.type}`, {
				method: 'GET',
				mode: 'cors',
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(signedRequestJSON => {
				const { signedRequest, fileOnBucketurl } = signedRequestJSON
				return fetch(signedRequest, {
					headers: {
						// Use empty string because S3 expects Origin Header
						'Origin': 'http://localhost:3000',
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
					return fetch(`http://localhost:3001/menus/${newMenuItemJSON._id}`, {
						headers: {
							'Content-Type': 'application/json',
							'x-access-token': token,
						},
						method: 'PUT',
						mode: 'cors',
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
		return fetch(`http://localhost:3001/menus/${itemID}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
			},
			method: 'PUT',
			mode: 'cors',
			body: JSON.stringify(data),
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			if (imageHandler.newImageFlag) { 
				return fetch(`http://localhost:3001/sign-s3?fileName=${imageHandler.imageSource.name}&fileType=${imageHandler.imageSource.type}`, {
					method: 'GET',
					mode: 'cors',
				})
				.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
				.then(signedRequestJSON => {
					const { signedRequest, fileOnBucketurl } = signedRequestJSON
					return fetch(signedRequest, {
						headers: {
							'Origin': 'http://localhost:3000',
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
						return fetch(`http://localhost:3001/menus/${itemID}`, {
							headers: {
								'Content-Type': 'application/json',
								'x-access-token': token,
							},
							method: 'PUT',
							mode: 'cors',
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

