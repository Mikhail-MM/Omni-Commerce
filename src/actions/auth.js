import { routeUserAfterLogin } from './routing'


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

export function attemptRegistration(credentials) {
	const url = (credentials.registrationPath === 'omni') ? 'http://localhost:3001/omni-master/' : 'http://localhost:3001/essos-user/'
	return dispatch => {
		return fetch(url, {
		headers:{
			'Content-Type': 'application/json'
		},
		method: 'POST',
		mode: 'cors', 
		body: JSON.stringify(credentials)
		})
		.then(json => {
			console.log('Use the ModalRoot component to display a confirmation message. Redirect to the appropriate node from the confirmation modal')
		})
		.catch(err => console.log(err))
	}
}
