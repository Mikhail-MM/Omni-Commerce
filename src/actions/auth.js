import { routeUserAfterLogin } from './routing'
import { showModal } from './modals'

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
		return fetch('http://localhost:3001/authorize', {
		headers:{
			'Content-Type': 'application/json'
		},
		method: 'POST',
		mode: 'cors', 
		body: JSON.stringify(credentials)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			dispatch(authSuccess(json))
			dispatch(routeUserAfterLogin(json.accountType))
		})
		.catch(err => dispatch(authFail(err.message)))
	}

}

export function attemptRegistration(token, data, imageHandler, mode) {
	return dispatch => {
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
				.then(response => {
					if (!response.ok) Promise.reject(response.statusText)
						return fileOnBucketurl
				})
				.then(avatarURL => {
					return fetch(`http://localhost:3001/registration/${mode}`, {
						headers:{
							'Content-Type': 'application/json'
						},
						method: 'POST',
						mode: 'cors', 
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
			return fetch(`http://localhost:3001/registration/${mode}`, {
				headers:{
					'Content-Type': 'application/json'
				},
				method: 'POST',
				mode: 'cors', 
				body: JSON.stringify({...data, avatarURL: imageHandler.imageSource})
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => {
				const { user } = json
				dispatch(showModal('REGISTRATION_CONFIRMATION_MODAL', { user, mode: mode,}))
			})
			.catch(err => console.log(err))
		}
	}
}
