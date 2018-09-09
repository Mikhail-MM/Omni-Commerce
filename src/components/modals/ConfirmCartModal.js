import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyleRound, TagMap } from '../config';
import { hideModal } from '../../actions/modals';
 
import { pushItemIntoShoppingCart } from '../../actions/shopping-cart'

import '../styles/ProductPage.css'

const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
	pushItemIntoShoppingCart: (token, itemID, requestedAmount, existingCountInCart) => dispatch(pushItemIntoShoppingCart(token, itemID, requestedAmount, existingCountInCart)),
})

const mapStateToProps = state => {
	const { token } = state.authReducer
	const { modalType, modalProps } = state.modalReducer
	const { shoppingCart } = state.shoppingCartReducer
	return { token, modalType, modalProps, shoppingCart }
}

class ConfirmCartModal extends Component {
	state = {
		requestedAmount: 1
	}
	
	handleChange = (input, value) => {
		if (value > 0) {
			this.setState({
				[input]: value
			})
		}
	}

	addItemToCart = (itemID) => {
		const { token, shoppingCart } = this.props
		let existingCountInCart = 0
		// WARNING: If we don't have a cached shopping cart, this check will fail and we will add too much to the cart. Could return a dispatch to fetch or just let failsafes take care of it
		if (shoppingCart.itemsBought.find(element => element.itemRef_id == itemID)) { 
			
			const itemIndex = shoppingCart.itemsBought.findIndex(element => element.itemRef_id == itemID)
			existingCountInCart = shoppingCart.itemsBought[itemIndex].numberRequested
			console.log(existingCountInCart);
		}
		return this.props.pushItemIntoShoppingCart(token, itemID, this.state.requestedAmount, existingCountInCart)
	}

	renderTagNotifs = (tags) => {
		console.log(tags)
		return tags.map(tag => {
			return(
				<div className='tag-icon-pair-container'>
					<div className='tag-icon-container'>
						<img src={TagMap[tag]} />
					</div>
					<div className='tag-name-container' style={{fontSize: '0.75em'}}>
						{tag}
					</div>
				</div>
			)
		})
	}

	render() {
		const { item } = this.props
		return(
			<div>
				<Modal
					isOpen={this.props.modalType === 'CONFIRM_CART_ADDITION'}
					style={modalStyleRound}
					contentLabel="Example Modal"
					overlayClassName="Overlay"
					>
					<div className='item-preview-container'>
						<div className='product-image-container'>
							<img src={item.imageURL} style={{borderRadius: '50px'}}/>
						</div>

						<div className='item-details-container'>
						<div style={{textAlign: 'center'}}>
							<h3> Item Information </h3>
						</div>
							<h4> {item.itemName} </h4>
							<div style={{display: 'flex'}}> { this.renderTagNotifs(item.tags) } </div>
							{(this.props.renderReviews) && this.props.renderReviews(item.reviews)}
							<p> {item.description} </p>
							<input type='number' value={this.state.requestedAmount} onChange={e => this.handleChange('requestedAmount', e.target.value)} />
							<button onClick={() => this.addItemToCart(item._id)}>Add To Cart</button>

							<button onClick={() => this.props.hideModal()}> Cancel </button>
						</div>
					</div>

				</Modal>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmCartModal)
