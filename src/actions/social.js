export const followUser = (token, userId, mode) => {
	return dispatch => {
		const controllerMode = { mode }
		return fetch(`http://localhost:3001/social/follow/${userId}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,			
			},
			method: 'PUT',
			mode: 'cors',
			body: JSON.stringify(controllerMode)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveFollowFeed(json)))
		.catch(err => console.log(err))
	}
}

function receiveFollowFeed(followContacts){
	return {
		type: 'RECEIVE_FOLLOW_FEED',
		followContacts 
	}
}

/*
const receiveFollowFeed = (followContacts) => ({
	type: 'RECEIVE_FOLLOW_FEED',
	followContacts
})

function receiveWishlist(wishlist) {
	return{
		type: 'RECEIVE_WISHLIST',
		wishlist
	}
}
*/