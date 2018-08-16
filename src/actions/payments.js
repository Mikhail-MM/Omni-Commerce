export function sendCashPaymentToApi(authToken, cashTendered, transaction_id) {
	const url = 'http://localhost:3001/transactions/' + transaction_id
	const data = {
		payment: {
			paymentType: "Cash",
			cashTenderedByCustomer: cashTendered,
		},
	}
	return dispatch => {
		fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': authToken,
			},
			method: 'GET',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			data.parentTransaction = json;
			fetch('http://localhost:3001/payments/cash', {
				headers:{
					'Content-Type': 'application/json',
					'x-access-token': authToken
				},
				method: 'POST',
				mode: 'cors',
				body: JSON.stringify(data),
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => {
				const data = { 
					payment: json.payment,
					status: "Paid"
				}
				return fetch(url, {
					headers:{
						'Content-Type': 'application/json',
						'x-access-token': authToken,
					},
					method: 'PUT',
					mode: 'cors',
					body: JSON.stringify(data),
				})
				.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
				.then(json => console.log(json))
				.catch(err => console.log(err))
			}) // Dispatch an event for the Cashier - Cash Register Screen
			.catch(err => console.log(err))
		})
		.catch(err => console.log(err))
	}
}

export function sendStripeTokenToApi(authToken, stripeToken, transaction_id) {
	// Need to ask API for price of the damn thang
	const url = 'http://localhost:3001/transactions/' + transaction_id
	const data = {}
	return dispatch => {
		fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': authToken,
			},
			method: 'GET',
			mode:'cors'
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			const data = {
				chargeTotal: json.totalReal,
				stripeToken: stripeToken,
			}

			return fetch('http://localhost:3001/payments/stripe', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': authToken
			},
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify(data)
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => {
				console.log("Receiving Stripe Charge from API")
				console.log(json)
				dispatch(updateTransactionWithStripePaymentDetails(authToken, transaction_id, json))
			})
			.catch(err => console.log(err))
		})
		.catch(err => console.log(err))
	}
}

function updateTransactionWithStripePaymentDetails(authToken, transaction_id, paymentJson) {
	const url = 'http://localhost:3001/transactions/' + transaction_id
	console.log(paymentJson)
	console.log(paymentJson.outcome)
	const data = {
		payment: {
			paymentType: "Stripe - Credit Card",
			stripeAmountInCents: paymentJson.amount,
			captured: paymentJson.captured,
			currency: paymentJson.currency,
			createdAt: new Date(paymentJson.created * 1000),
			// TODO: Customer Management
			description: paymentJson.description,
			stripeCharge_id: paymentJson.id,
			metadata: {
				parentTransaction_id: transaction_id, // Not sure if decoupling this from Stripe's returned charge is a good idea, but we would be setting it in the first place anyway
			},
			outcome: {
				network_status: paymentJson.outcome.network_status,
				// reason: paymentJson.outcome.reason, --- Only allow reason if it is provided. Mongoose accepts it as a string, so the default null when no error throws an error
				risk_level: paymentJson.outcome.risk_level,
				seller_message: paymentJson.outcome.seller_message,
				outcomeType: paymentJson.outcome.type,
			},
			//TODO: Refunded values
			paid: paymentJson.paid,
			cardSource: {
			address_city: paymentJson.source.address_city,
			address_country: paymentJson.source.address_country,
			address_line1: paymentJson.source.address_line1,
			address_line2: paymentJson.source.address_line2,
			address_zip: paymentJson.source.address_zip,
			address_zip_check: paymentJson.source.address_zip_check,
			brand: paymentJson.source.brand,
			country: paymentJson.source.country,
			cvc_check: paymentJson.source.cvc_check,
			exp_month: paymentJson.source.exp_month,
			exp_year: paymentJson.source.exp_year,
			fingerprint: paymentJson.source.fingerprint,
			funding: paymentJson.source.funding,
			card_id: paymentJson.source.card_id,
			last4: paymentJson.source.last4,
			name: paymentJson.source.name,
			status: paymentJson.source.status,
		},
	 },
	}
	if (paymentJson.paid) data.status = "Paid";
	console.log(data)
	console.log(data.payment)
	console.log(data.payment.outcome.network_status)
	console.log(typeof(data.payment.outcome.network_status))
	return dispatch =>  {
		return fetch(url, {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': authToken
			},
			method: 'PUT',
			mode: 'cors',
			body: JSON.stringify(data),
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => console.log(json))
		.catch(err => console.log(err))
	}
}

export function beginCartPaymentValidationCascade(authToken, token) {
	return dispatch => {
		return fetch('http://localhost:3001/shoppingCart/payment/', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': authToken
			},
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify({stripeToken: token})
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			console.log("Returning heavy response from payment endpoints - ensure data validity")
			console.log(json)
		})
		.catch(err => console.log(err));
	}
}