import React from 'react';
import { connect } from 'react-redux'
import { Elements, CardElement, StripeProvider, injectStripe} from 'react-stripe-elements';

import { stripeAPIkey } from '../../privateConfig.js'

import { sendStripeTokenToApi, beginCartPaymentValidationCascade } from '../../actions/payments'

const mapStateToProps = state => {

	const authToken = state.authReducer.token;
	const { activeTicket } = state.ticketTrackingReducer
	return { authToken, activeTicket }

}

const mapDispatchToProps = dispatch => ({
	sendOmniStripeTokenToApi: (authToken, stripeToken, ticketId) => {
		dispatch(sendStripeTokenToApi(authToken, stripeToken, ticketId))
	},
	sendEssosStripeTokenToApi: (authToken, stripeToken) => {
		dispatch(beginCartPaymentValidationCascade(authToken, stripeToken))
	},
})

const CardSection = props => {
		return (
		<label>
			Card Details
			<CardElement style={{base: {fontSize: '18px'}}}/>
		</label>
	);
};

const PaymentCheckoutForm = props => {
	console.log(props)
	const { authToken, activeTicket } = props
	const { sendOmniStripeTokenToApi } = props

	const handleSubmit = event => {
		event.preventDefault()
		// TODO : Inject form to get Customer's Name at Checkout by Cashier
		// Will need to convert to Class Component.
		if (props.apiStripePath === 'Omni') {
			props.stripe.createToken({name: 'Random Customer'})
				.then(({token}) => {
					sendOmniStripeTokenToApi(authToken, token, activeTicket._id)
				})
		}
		if (props.apiStripePath === 'Essos') {
			// Get Client Metadata -- Shipping and Billing info -- This should be provided by the customer on the cart checkout form instead of being tied permanently to account...
			fetch('/client/metadata', {
				headers:{
					'Content-Type': 'application/json',
					'x-access-token': authToken,
				},
				method: 'GET',	
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => {
			
				const { address_line1, address_line2, address_city, address_state, address_zip, address_country, name } = json
			
				props.stripe.createToken({
				
					name,
					address_line1,
					address_line2,
					address_city,
					address_state,
					address_zip,
					address_country,

				})
				.then(({token}) => {
					props.sendEssosStripeTokenToApi(authToken, token)
				});
			})
			.catch(err => console.log(err))
		
		}
	}

	return(
		<form onSubmit={(event) => handleSubmit(event)}>
			<CardSection />
			<button>Confirm Order</button>
		</form>
	)
}



const ConnectedInjectedCheckoutForm = injectStripe(connect(mapStateToProps, mapDispatchToProps)(PaymentCheckoutForm))

const Checkout = props => {
	return(
		<StripeProvider apiKey={stripeAPIkey}>
			<Elements>
				<ConnectedInjectedCheckoutForm apiStripePath={props.apiStripePath}/>
			</Elements>
		</StripeProvider>
		);
}

export default Checkout;
