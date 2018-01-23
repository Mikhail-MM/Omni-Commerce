import React from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';

import ConnectedInjectedCheckoutForm from './PaymentCheckoutForm'
import privateConfig from '../privateConfig'

class Checkout extends React.Component {
	render() {
		return(
			<StripeProvider apiKey={privateConfig.publishableKey}>
			 <Elements>
				 <ConnectedInjectedCheckoutForm />
			 </Elements>
			</StripeProvider>
		);
	}
}

export default Checkout;