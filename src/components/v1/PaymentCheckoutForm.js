import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectStripe } from 'react-stripe-elements'

import { sendStripeTokenToApi } from '../actions/payments'

import CardSection from './CardSection'

function mapStateToProps(state) {
	const authToken = state.authReducer.token;
	const { activeTicket } = state.ticketTrackingReducer
	return { authToken, activeTicket }
}

class PaymentCheckoutForm extends Component {
	constructor(props){
		super(props)
		this.state = { }
	}
	handleSubmit = (event) => {
		event.preventDefault()
		const { authToken, activeTicket, dispatch } = this.props
		this.props.stripe.createToken({name: 'Random Customer'}).then(({token}) => {
			dispatch(sendStripeTokenToApi(authToken, token, activeTicket._id))
		
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