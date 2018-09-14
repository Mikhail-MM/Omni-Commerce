export const followUser = (token, userId, mode) => {
	return dispatch => {
		const controllerMode = { mode }
		return fetch(`/social/follow/${userId}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,			
			},
			method: 'PUT',
			body: JSON.stringify(controllerMode)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveFollowFeed(json)))
		.catch(err => console.log(err))
	}
}

export const getUserSocialFeed = (token) => {
	return dispatch => {
		return fetch(`/users/essos/getProfileView/ownProfile`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,			
			},
			method: 'GET',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveFollowFeed(json.following)))
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