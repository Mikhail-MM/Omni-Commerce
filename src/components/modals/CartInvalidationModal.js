import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

const mapStateToProps = state => {
	const { invalidatedItems } = state.shoppingCartReducer
	return { invalidatedItems }
}

const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
})

const generateCartInvalidationAlert = () => {
	return(
		const { invalidatedItems } = this.props
		
		if (typeof(invalidatedItems) === "array") {
				return invalidatedItems.itemsBought.map(removedItem => {
					return(
						<div>
							{ `Item Removed: ${removedItem.itemName} could not be purchased - ${removedItem.unfulfillableStock} instance(s) removed.` } 
						</div>
					)
		})}
		else if (typeof(invalidatedItems) === "object") {
			return (
				<div>
					{ `Item Removed: ${invalidatedItems.itemName} could not be purchased - ${removedItem.unfulfillableStock} instance(s) removed.`}
				</div>
				)
		}
	)
}

const CartInvalidationModal = props => {
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'CART_INVALIDATION_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				>
				<div>
					<h4> Some items were removed from your shopping cart. The seller does not have sufficient stock to fulfill your entire order. </h4>
				</div>
				{ invalidatedItems && this.generateCartInvalidationAlert()}
				<button onClick={() => props.hideModal()}> Cancel </button>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(CartInvalidationModal)