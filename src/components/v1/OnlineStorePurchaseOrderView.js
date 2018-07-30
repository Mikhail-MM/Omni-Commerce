import React, { Component } from 'react'
import { connect } from 'react-redux'

function mapStateToProps(state) {
	const { token } = state.authReducer
	return { token }
}

class PurchaseOrderViewer extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount() {
		// dispatch an action to retreive the seller's purchaseorders with shipping status
		// we should have some webhooks into FedEx shipping API
	}
	generateItemsFromDOM() {
		
	}

	render() {
		return(

		)
	}
}

export default connect(mapStateToProps)(PurchaseOrderViewer)