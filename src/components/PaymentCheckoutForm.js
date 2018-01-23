import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectStripe } from 'react-stripe-elements'

import { sendStripeTokenToApi } from '../actions/payments'

import CardSection from './CardSection'

function mapStateToProps(state) {
	const authToken = state.authReducer.token;
	return { authToken }
}

class PaymentCheckoutForm extends Component {
	constructor(props){
		super(props)
		this.state = { }
	}
	handleSubmit = (event) => {
		event.preventDefault()
		const { authToken, dispatch } = this.props
		this.props.stripe.createToken({name: 'Random Customer'}).then(({token}) => {
			console.log('Received Stripe token:', token);
			console.log('Received Omni-Commerce User Authorization Token from Redux Store:', authToken);
			dispatch(sendStripeTokenToApi(authToken, token))
		
		}); 
	}

	render() {
		return(
			<form onSubmit={this.handleSubmit}>
				<CardSection />
				<button>Confirm Order</button>
			</form>
		);
	}
};

export default injectStripe(connect(mapStateToProps)(PaymentCheckoutForm));