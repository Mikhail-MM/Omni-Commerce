import React, { Component } from 'react'
import { connect } from 'react-redux'

import ModalRoot from './ModalRoot'
import { validateCartAndProceedToPayment, pullItemFromCart } from '../actions/shopping-cart'
const mapStateToProps = state => {

	const { token, isAuthenticated } = state.authReducer
	const { shoppingCart } = state.shoppingCartReducer
	return { token, isAuthenticated, shoppingCart }

}

const mapDispatchToProps = dispatch => ({
	handleCheckout: (token) => dispatch(validateCartAndProceedToPayment(token)),
	removeItem: (token, subdocID) => dispatch(pullItemFromCart(token, subdocID))
})

/* 

	Note: Need to move Shipping/Billing Address out of account credentials and into a session-specific form

*/
const EssosCartCheckout = props => {
	const { shoppingCart, token } = props

	const generateShoppingCartDropdownContent = () => {
		
		return shoppingCart.itemsBought.map(item => {
			return(
				<div className='cart-item-container-row'>
					<div className='cart-item-mini-image-container'>
						<img className='cart-item-mini-image' src={item.imageURL} />
					</div>
					<div className='cart-item-descriptor-container'>
						<div className='cart-item-name-container'>
							{item.itemName}
						</div>
						<div className='cart-item-quant-container'>
							{`Quantity Requested: ${item.numberRequested}`}
						</div>
						<div className='cart-item-price-container' >
							{`Cost Per Unit: $${item.itemPrice}`}
						</div>
						<div className='removal' onClick={() => props.removeItem(token, item._id)}>
							Remove
						</div>
					</div>
				</div>
			)
		})		
	}

	return(
		<div className='app-root' style={{backgroundColor: 'black'}}>
			<ModalRoot/>
			<div className='header-container'>
				<h1 style={{color: 'white'}}> Shopping Cart Checkout </h1>
			</div>
			<div className='shopping-cart-dropdown-container'>
				{ shoppingCart && generateShoppingCartDropdownContent() }
			</div>
			<button onClick={() => props.handleCheckout(token)}> Confirm order </button>
		</div>
	)
} 

export default connect(mapStateToProps, mapDispatchToProps)(EssosCartCheckout)