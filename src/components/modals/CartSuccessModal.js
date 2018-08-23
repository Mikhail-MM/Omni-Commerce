import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import Checkout from '../stripe/Checkout'

const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
})

const mapStateToProps = (state) => {
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps }
}

const CartSuccessModal = props => {
	console.log(props)
	return(

		<div>
			<Modal
				isOpen={props.modalType === 'CART_ADDITION_SUCCESS_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				>

				<div>
					<h2> 
						{`Successfully Added  ${props.itemName} to cart.`}
					</h2>
					<button onClick={() => props.hideModal()}> Okay. </button>
				</div>
				

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(CartSuccessModal)