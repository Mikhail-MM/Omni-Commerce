import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectStripe } from 'react-stripe-elements'
/* TODO: Replace this action with a new one to save customer's info and start new Payment Cascade resulting in the following steps:
import { sendStripeTokenToApi } from '../actions/payments'
1) Capture customer's credit card information and make a preliminary charge
 note: The action will likely begin by going to cart/userLookup to bring the cart into context and producing a relavant payment charge amount
2) Enter 3 tier validation and decrementing of listed storestock
3) creation of purchase order
4) capture charge info with validated cart pricing
5) append stripe charge to purchase order
6) send general purchase order to buyer
7) divvy up shipping orders to sellers

*/
import { beginCartPaymentValidationCascade } from '../actions/payments'





import CardSection from './CardSection'

function mapStateToProps(state) {
	const authToken = state.authReducer.token;
	const { activeTicket } = state.ticketTrackingReducer
	return { authToken, activeTicket }
}

class OnlineStoreStripeCheckout extends Component {
	constructor(props){
		super(props)
		this.state = { }
	}
	
handleSubmit = (event) => {
		event.preventDefault()

		const { authToken, activeTicket, dispatch } = this.props;

		// This can be moved to a new thunk in actions

		fetch('http://localhost:3001/client/metadata', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': authToken,
			},
			method: 'GET',
			mode: 'cors',	
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			
			const { address_line1, address_line2, address_city, address_state, address_zip, address_country } = json
			
			this.props.stripe.createToken({
				
				name: json.name,
				address_line1,
				address_line2,
				address_city,
				address_state,
				address_zip,
				address_country,

			})
			.then(({token}) => {
				dispatch(beginCartPaymentValidationCascade(authToken, token));
			});
		})
	}
	// We can possibly connect this component to cached cart data just to show the customer how much he is paying...
	render() {
		return(
			<form onSubmit={this.handleSubmit}>
				<CardSection />
				<button>Confirm Order</button>
			</form>
		);
	}
};

export default injectStripe(connect(mapStateToProps)(OnlineStoreStripeCheckout));