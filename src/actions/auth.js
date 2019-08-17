import { routeUserAfterLogin } from './routing'
import { showModal, hideModal } from './modals'

import { 
	hostURI,
	corsSetting
 } from '../components/config'

export function authSuccess (userInfo) {
	return {
	type:'USER_AUTHENTICATED',
		userInfo
	}

} 

function authFail (err) {
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
	const url = `${hostURI}/authorize`
	console.log(url);
	return dispatch => {
		return fetch(url, {
			headers:{
				'Content-Type': 'application/json'
			},
			method: 'POST',
			mode: 'cors', 
			body: JSON.stringify(credentials)
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			console.log(json)
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
			return fetch(`${hostURI}/sign-s3?fileName=${imageHandler.imageSource.name}&fileType=${imageHandler.imageSource.type}`, {
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
					return fetch(`${hostURI}/registration/${mode}`, {
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
			return fetch(`${hostURI}/registration/${mode}`, {
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
