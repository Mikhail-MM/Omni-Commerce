import React from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';

import ConnectedInjectedCheckoutForm from './OnlineStoreStripeCheckout'


class OnlineStoreCheckout extends React.Component {
	render() {
		return(
			<StripeProvider apiKey={'privateConfig.publishableKey'}>
			 <Elements>
				 <ConnectedInjectedCheckoutForm />
			 </Elements>
			</StripeProvider>
		);
	}
}

export default OnlineStoreCheckout;