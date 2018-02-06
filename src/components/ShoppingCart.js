import React, { Component } from 'react'
import { connect } from 'react-redux'

import { retrieveShoppingCart, pullItemFromCart } from '../actions/marketplaces'
import { validateCartAndProceedToPayment } from '../actions/marketplaces'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { shoppingCart } = state.shoppingCartReducer
	return { token, shoppingCart }
}


class ShoppingCart extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
		this.generateShoppingCartDOMElements = this.generateShoppingCartDOMElements.bind(this)
		this.handleCheckOut = this.handleCheckOut.bind(this)
	}

	componentDidMount() {
		const { dispatch, token } = this.props
		console.log("Retrieving Shopping Cart")
		console.log(token)
		dispatch(retrieveShoppingCart(token))
	}

	generateShoppingCartDOMElements() {
		const { shoppingCart, token } = this.props
		console.log("Attempting to generate Shopping Cart Elements")
		console.log(shoppingCart)
		console.log(shoppingCart.itemsBought)
		if (shoppingCart.itemsBought.length > 0) {
			return shoppingCart.itemsBought.map(cartItem => {
				return (<div>
							<div 
								key={cartItem._id}>
									{cartItem.itemName} Count {cartItem.numberRequested}
							</div>
							<button onClick={this.removeItem.bind(this, cartItem._id)}> Remove Item </button>
						</div>
				)
			})
		}
		else if (shoppingCart.itemsBought.length === 0) {
			return <h3> Your shopping cart is empty </h3>
		}
		else if (!shoppingCart.itemsBought) {
			return <h5> Dangerous server error! Can't find your itemsBought array! </h5>
		}
	}

	generateShoppingCartPriceFieldDOMElements() {
		
	}
	handleCheckOut() {
		const { dispatch, token, } = this.props;

		dispatch(validateCartAndProceedToPayment(token));
	}
	removeItem(cartItemPositionId) {
		const{ dispatch, token } = this.props
		console.log("Dispatching pullItemFromCart")
		console.log("cartItemPositionId:")
		console.log(cartItemPositionId)
		dispatch(pullItemFromCart(token, cartItemPositionId))

	}
	render() {
		const { shoppingCart } = this.props

		return(
			<div>
			<h1>Shopping Cart</h1>
			{ shoppingCart && this.generateShoppingCartDOMElements() }
			<button onClick={this.handleCheckOut}>Check Out</button>
			</div>
		)
	}
}

export default connect(mapStateToProps)(ShoppingCart)