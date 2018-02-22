import React, { Component } from 'react'
import { connect } from 'react-redux'

import { retrieveMyShippingOrders } from '../actions/marketplaces'

function mapStateToProps(state){
	const { token } = state.authReducer
	const { purchaseOrders } = state.purchaseOrderReducer
	return { purchaseOrders, token }
}

class PurchaseOrderViewScreen extends Component {
	constructor(props){
		super(props)
	}

	componentDidMount() {
		const { dispatch, token } = this.props
		dispatch(retrieveMyShippingOrders(token))
	}

	render() {
		return(
			<div> PurchaseOrders </div>
		)
	}	
}

export default connect(mapStateToProps)(PurchaseOrderViewScreen)