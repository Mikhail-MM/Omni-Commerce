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
		// fix this method
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(organizeItemsToCategories(json)))
		.catch(err => console.log(err)) 
	}
}


// Create New Terminal Item with Image

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

			console.log("New Item JSON data", newMenuItemJSON)
			
			const formData = new FormData()

			formData.append('menuItems', imageFile) 

			fetch('http://localhost:3001/images/point-of-sale-item', {
					method: 'POST',
					mode: 'cors',
					body: formData
				})
				.then(response => response.ok ? response.json() :Promise.reject(response.statusText))
				.then(imageJSON => {
					
					console.log("Receive image metadata")
					console.log(imageJSON)

					const updatedImageSourceJSON = { imageURL: imageJSON.imageURL }

					const url = 'http://localhost:3001/menus/' +  newMenuItemJSON._id
					return fetch(url, {
						headers: {
							'Content-Type': 'application/json',
							'x-access-token': token,
						},
						method: 'PUT',
						mode: 'cors',
						body: JSON.stringify(updatedImageSourceJSON)
					})
					.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
					.then(newItemJSONWithImageURL => {
						
						console.log("updated item", newItemJSONWithImageURL)

						dispatch(fetchMenuItems(token))
						dispatch(showModal('SHOW_ITEM_UPLOAD_SUCCESS_MODAL', {...newItemJSONWithImageURL}))

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
				const formData = new FormData()
				formData.append('menuItems', imageHandler.imageSource)
				return fetch('http://localhost:3001/images/point-of-sale-item', {
					method: 'POST',
					mode: 'cors',
					body: formData
				})
				.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
				.then(fileUploadResponse => {
					console.log("Receive Image Metadata", fileUploadResponse)
					const imageURLJSON = { imageURL: fileUploadResponse.imageURL} 
					return fetch(`http://localhost:3001/menus/${itemID}`, {
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
						dispatch(fetchMenuItems(token))
						dispatch(showModal('SHOW_ITEM_UPLOAD_SUCCESS_MODAL', {...modifiedItemJSONWithImageURL}))
					})
				})
			} else if (imageHandler.newImageFlag === null) {
				console.log("No Image Change. Logging new item attributes: ", json)
				console.log("Client fetching all items")
				dispatch(fetchMenuItems(token))
				dispatch(showModal('SHOW_ITEM_UPLOAD_SUCCESS_MODAL', {...json}))
			}
		})
		.catch(err => console.log(err))
	}
}
