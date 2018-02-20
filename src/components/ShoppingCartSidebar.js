import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Menu, Table, Button } from 'semantic-ui-react'

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
		const { shoppingCart } = this.props
		console.log("Attempting to generate Shopping Cart Elements")
		console.log(shoppingCart)
		console.log(shoppingCart.itemsBought)
		if (!shoppingCart.itemsBought) {
			return <Menu.Item header> Dangerous server error! Can't find your itemsBought array! </Menu.Item>
		}
		if (shoppingCart.itemsBought.length > 0) {
			return shoppingCart.itemsBought.map(cartItem => {
				return (<div className='shopping-cart-item-wrapper'>
							<div 
								key={cartItem._id}>
									{cartItem.itemName} Count {cartItem.numberRequested}
							</div>
							<Button onClick={this.removeItem.bind(this, cartItem._id)}> Remove Item </Button>
						</div>
				)
			})
		}
		else if (shoppingCart.itemsBought.length === 0) {
			return <h3 style={{color: 'white'}}> Your shopping cart is empty </h3>
		}
	}

	generateShoppingCartPriceFieldDOMElements() {
		const { shoppingCart } = this.props
		return(
			<Table celled inverted selectable>
			<Table.Footer> 
			  <Table.Row>
			   <Table.HeaderCell colSpan="3">SubTotal</Table.HeaderCell>
			   <Table.Cell>${shoppingCart.subtotalDisplay}</Table.Cell>
			  </Table.Row>
			  <Table.Row>
			   <Table.HeaderCell colSpan="3">Tax</Table.HeaderCell>
			   <Table.Cell>${shoppingCart.taxDisplay}</Table.Cell>
			  </Table.Row>
			  <Table.Row>
			   <Table.HeaderCell colSpan="3">Total</Table.HeaderCell>
			   <Table.Cell>${shoppingCart.totalDisplay}</Table.Cell>
			  </Table.Row>
		  	</Table.Footer>
		  	</Table>
		)
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
			<div className="shopping-cart-inner-container">
			{ shoppingCart && this.generateShoppingCartPriceFieldDOMElements()}
			{ shoppingCart && this.generateShoppingCartDOMElements() }
			{ !shoppingCart && <Menu.Item header> We couldn't find your shopping cart! Sorry! </Menu.Item> }
			</div>
		)
	}
}

export default connect(mapStateToProps)(ShoppingCartSidebar)