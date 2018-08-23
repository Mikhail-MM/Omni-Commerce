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

const CardPaymentModal = props => {
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'CARD_PAYMENT_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				>
				<div style={{height: 80, width: 700}}>
					<Checkout apiStripePath='Omni'/>
				</div>
				<button onClick={() => props.hideModal()}> Cancel </button>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(CardPaymentModal)