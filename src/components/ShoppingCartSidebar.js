import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Menu } from 'semantic-ui-react'

import { retrieveShoppingCart, pullItemFromCart } from '../actions/marketplaces'
import { validateCartAndProceedToPayment } from '../actions/marketplaces'


function mapStateToProps(state) {
	const { token } = state.authReducer
	const { shoppingCart } = state.shoppingCartReducer
	return { token, shoppingCart }
}


class ShoppingCartSidebar extends Component {
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
		if (!shoppingCart.itemsBought) {
			return <Menu.Item header> Dangerous server error! Can't find your itemsBought array! </Menu.Item>
		}
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
			{ shoppingCart && this.generateShoppingCartDOMElements() }
			{ !shoppingCart && <Menu.Item header> We couldn't find your shopping cart! Sorry! </Menu.Item> }
			</div>
		)
	}
}

export default connect(mapStateToProps)(ShoppingCartSidebar)