import React from 'react';
import { connect } from 'react-redux'
import { Elements, CardElement, StripeProvider, injectStripe} from 'react-stripe-elements';

import { sendStripeTokenToApi } from '../../actions/payments'

const mapStateToProps = state => {

	const authToken = state.authReducer.token;
	const { activeTicket } = state.ticketTrackingReducer
	return { authToken, activeTicket }

}

const mapDispatchToProps = dispatch => ({
	sendStripeTokenToApi: (authToken, stripeToken, ticketId) => {
		dispatch(sendStripeTokenToApi(authToken, stripeToken, ticketId))
	}
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

	const { authToken, activeTicket } = props
	const { sendStripeTokenToApi } = props

	const handleSubmit = event => {
		event.preventDefault()
		// TODO : Inject form to get Customer's Name at Checkout by Cashier
		// Will need to convert to Class Component.
		this.props.stripe.createToken({name: 'Random Customer'})
			.then(({token}) => {
				this.props.sendStripeTokenToApi(authToken, token, activeTicket._id)
			})
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
		<StripeProvider apiKey={'TODO: Add Private Publishable Key'}>
			<Elements>
				<ConnectedInjectedCheckoutForm />
			</Elements>
		</StripeProvider>
		);
}

export default Checkout;