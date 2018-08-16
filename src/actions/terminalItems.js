import { groupBy } from 'underscore'

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
			
			dispatch(fetchMenuItems(token))

			fetch('http://localhost:3001/images/point-of-sale-item', {
					method: 'POST',
					mode: 'cors',
					body: formData
				})
				.then(response => response.ok ? response.json() : console.log(response))
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

						// A good place to add a confirmation modal here
					})
				})
		})
		.catch(err => console.log(err))
	}
}