import fetch from 'cross-fetch'

export function sendStripeTokenToApi(authToken, stripeToken) {
	return dispatch => {
		return fetch('http://localhost:3001/payments', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': authToken
			},
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify(stripeToken)
		})
		.then(response => response.ok ? response.json() : new Error(response.statusText))
		.then(json => console.log(json))
		.catch(err => console.log(err))
	}
}

