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
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => dispatch(organizeItemsToCategories(json)))
		.catch(err => console.log(err)) 
	}
}