import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import { disregardInvalidatedItems } from '../../actions/shopping-cart'

const mapStateToProps = state => {
	const { invalidatedItems } = state.shoppingCartReducer
	const { modalType, modalProps } = state.modalReducer
	return { invalidatedItems, modalType, modalProps}
}

const mapDispatchToProps = dispatch => ({
	hideModal: () => {
		dispatch(disregardInvalidatedItems())
		dispatch(hideModal())
	},
})


const CartInvalidationModal = props => {

	const { invalidatedItems } = props

	const generateCartInvalidationAlert = () => {
		return invalidatedItems.map(removedItem => {
			return ( <div> { `Item Removed: ${removedItem.itemName} could not be purchased - ${removedItem.numberRequested} instance(s) removed.` } </div> )
		})
	}



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
				{ invalidatedItems && generateCartInvalidationAlert()}
				<button onClick={() => props.hideModal()}> Understood. </button>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(CartInvalidationModal)