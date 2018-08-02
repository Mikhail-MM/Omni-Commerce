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
		.then(response => response.ok ? response.json() : new Error(response.statusText))
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
			.then(response => response.ok ? response.json() : new Error(response.statusText))
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
				.then(response => response.ok ? response.json() : new Error(response.statusText))
				.then(json => console.log(json))
				.catch(err => console.log(err))
			}) // Dispatch an event for the Cashier - Cash Register Screen
			.catch(err => console.log(err))
		})
		.catch(err => console.log(err))
}