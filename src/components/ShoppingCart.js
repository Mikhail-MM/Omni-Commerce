import React, { Component } from 'react'
import { connect } from 'react-redux'

import { retrieveShoppingCart, pullItemFromCart } from '../actions/marketplaces'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { shoppingCart } = shoppingCartReducer
	return { token, shoppingCart }
}

class ShoppingCart extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
		this.generateShoppingCartDOMElements = this.generateShoppingCartDOMElements.bind(this)
	}

	componentDidMount() {
		const { dispatch, token } = this.props
		dispatch(retrieveShoppingCart(token))
	}

	generateShoppingCartDOMElements() {
		const { shoppingCart, token } = this.props
		return shoppingCart.itemsBought.map(cartItem => {
			<div 
				key={cartItem._id}>
					{cartItem.itemName}
			</div>
			<button onClick={this.removeItem.bind(this, token, cartItem._id)}> Remove Item </button>
		})
	}

	removeItem(token, cartItemPositionId) {
		const{ dispatch } = this.props
		dispatch(pullItemFromCart(token, cartItemPositionId))

	}
	render() {
		const { shoppingCart } = this.props

		return(

		)
	}
}

export default connect(mapStateToProps)(ShoppingCart)