import { routeUserAfterLogin } from './routing'
import { showModal, hideModal } from './modals'

function authSuccess (userInfo) {
	console.log(userInfo)
	return {
	type:'USER_AUTHENTICATED',
	userInfo
	}

} 

function authFail (err) {
	console.log('sending error text to auth reducer... why is it not found? ')
	return {
	type: 'INVALID_CREDENTIALS',
	errorText: err,
	}
}

export function logOut() {
	return {
	type: 'LOG_OUT'
	}
}

export function attemptLogIn(credentials) {
	console.log(credentials)
	return dispatch => {
		return fetch('/authorize', {
		headers:{
			'Content-Type': 'application/json'
		},
		method: 'POST',
		mode: 'no-cors',
		body: JSON.stringify(credentials)
		})
		.then(response => {
			console.log(response)
			return 'test'
		})
		.then(json => {
			dispatch(authSuccess(json))
			dispatch(routeUserAfterLogin(json.accountType))
			dispatch(hideModal())
		})
		.catch(err => dispatch(authFail(err.message)))
	}
}

export function attemptRegistration(token, data, imageHandler, mode) {
	return dispatch => {
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
				.then(response => {
					if (!response.ok) Promise.reject(response.statusText)
						return fileOnBucketurl
				})
				.then(avatarURL => {
					return fetch(`/registration/${mode}`, {
						headers:{
							'Content-Type': 'application/json',
							'x-access-token': token
						},
						method: 'POST', 
						body: JSON.stringify({...data, avatarURL})
					})
					.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
					.then(json => {
						const { user } = json
						dispatch(showModal('REGISTRATION_CONFIRMATION_MODAL', { user, mode: mode,}))
					})
				})
			})
			.catch(err => console.log(err))
		} else if (!imageHandler.newImageFlag) {
			console.log(imageHandler)
			return fetch(`/registration/${mode}`, {
				headers:{
					'Content-Type': 'application/json',
					'x-access-token': token
				},
				method: 'POST',
				body: JSON.stringify({...data, avatarURL: imageHandler.imageSource})
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => {
				const { user } = json
				console.log(mode)
				dispatch(showModal('REGISTRATION_CONFIRMATION_MODAL', { user, mode: mode,}))
			})
			.catch(err => console.log(err))
		}
	}
}
