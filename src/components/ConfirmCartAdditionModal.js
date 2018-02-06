import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import { pushItemIntoShoppingCart } from '../actions/marketplaces'
import { hideModal } from '../actions/modals'

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	}
};

function mapStateToProps(state) {
	const { currentMarketplaceItem } = state.marketplaceItemsReducer
 	const { token } = state.authReducer
	const { modalType } = state.modalReducer
	const { shoppingCart } = state.shoppingCartReducer
	return { modalType, token, currentMarketplaceItem, shoppingCart  }
}

class ConfirmCartAdditionModal extends Component {
	constructor(props){
		super(props);
		this.state = {
			requestedAmount: 1 // must prevent negative values
		}
		this.deactivateModal = this.deactivateModal.bind(this)
	}

	handleChange(input, value) {
		this.setState({
			[input]: value
		})
	}

	addItemToCart(itemId) {
		const { dispatch, token, shoppingCart } = this.props
		console.log("Looking if item is already in cart, before adding item to shopping cart, existingCountInCart defaulting to 0")
		var existingCountInCart = 0
		// WARNING: If we don't have a cached shopping cart, this check will fail and we will add too much to the cart. Could return a dispatch to fetch or just let failsafes take care of it
		if (shoppingCart.itemsBought.find(element => element.itemRef_id == itemId)) {
			console.log("Item that user is adding to cart already exists as entity in their shopping cart by itemRef_id")
			const itemIndex = shoppingCart.itemsBought.findIndex(element => element.itemRef_id == itemId)
			console.log("Sending Updating existingCountInCart To Dispatch: ")
			existingCountInCart = shoppingCart.itemsBought[itemIndex].numberRequested
			console.log(existingCountInCart);
		}
		dispatch(pushItemIntoShoppingCart(token, itemId, this.state.requestedAmount, existingCountInCart))
	}

	deactivateModal() {
		const { dispatch } = this.props
		dispatch(hideModal())
	}

	render(){
		// This can be moved to the actual component's props instead of a redux connection to avoid perf hit

		const { modalType, currentMarketplaceItem} = this.props
		
		return(
			<div>
				<Modal
					isOpen={modalType === 'CONFIRM_CART_ADDITION'}
					style={customStyles}
					contentLabel="Add Item Confirmation"
				>
					<h3>Confirm Your Order!</h3>
					{currentMarketplaceItem &&
						<div>
							<h4> Confirm your purchase of {currentMarketplaceItem.itemName} </h4>
							<input type='number' value={this.state.requestedAmount} onChange={e => this.handleChange('requestedAmount', e.target.value)} />
							<button onClick={this.addItemToCart.bind(this, currentMarketplaceItem._id)}>Add To Cart</button>
						</div>
					}
					<button onClick={this.deactivateModal}> Cancel </button>
				</Modal>
			</div>
		)

	}

}

export default connect(mapStateToProps)(ConfirmCartAdditionModal)