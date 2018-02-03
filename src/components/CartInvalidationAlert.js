import React, { Component } from 'react';
import { connect } from 'react-redux';

import { disregardInvalidatedItems } from '../actions/marketplaces'

function mapStateToProps(state) {
	const { invalidatedItems } = state.shoppingCartReducer
	return { invalidatedItems }
}
class CartInvalidationAlert extends Component {
	constructor(props){
		super(props)
		this.state = {}
		this.generateInvalidatedCartItemNotification = this.generateInvalidatedCartItemNotification.bind(this)
		this.clearInvalidation = this.clearInvalidation.bind(this)
	}
	generateInvalidatedCartItemNotification() {
		const { invalidatedItems } = this.props
		return invalidatedItems.map(removedItem => {
			return(
				<div><span>{removedItem.itemName}</span> was removed from your cart due to insufficient stock </div>
			)
		})
	}
	
	clearInvalidation() {
		const { dispatch } = this.props;
		dispatch(disregardInvalidatedItems())
	}

	// Keep an eye out for whether this conditional modal removal thing works
	render() {
		const { invalidatedItems } = this.props
		const { modalRemoval } = this.props
		return(
			{invalidatedItems && <h3>We're sorry - Parts of your order were not fulfilled - Merchant has insufficient stock</h3> }
			{invalidatedItems && this.generateInvalidatedCartItemNotification()}
			{invalidatedItems && !modalRemoval && <button onClick={this.clearInvalidation}> Close Notification </button>}
			{modalRemoval && <button onClick={modalRemoval}> Continue </button>}
		}
		}
		)
	}
}

export default connect(mapStateToProps)(CartInvalidationAlert)