import React, { Component } from 'react'
import { connect } from 'react-redux'

import { retrieveMyPurchaseOrders } from '../actions/marketplaces'

function mapStateToProps(state){
	const { token } = state.authReducer
	const { shippingOrders } = state.purchaseOrderReducer
	return { token, shippingOrders }
}
class ShippingOrderViewScreen extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount(){
		const { dispatch, token } = this.props
		dispatch(retrieveMyPurchaseOrders(token))
	}

	render() {
		return(
			<div> Shipping Orders </div>
		)
	}
}

export default connect(mapStateToProps)(ShippingOrderViewScreen)