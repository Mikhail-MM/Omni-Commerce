import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { showModal, hideModal } from '../../actions/modals';


const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps))
})

const mapStateToProps = (state) => {
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps }
}


const PaymentTypeSelectionModal = props => {
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'CASH_OR_CARD_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				>

				<div style={{display: 'flex'}}className='centered-modal-wrapper'>
					<div 
						style={{width: 56, height: 56, borderRadius:30, backgroundColor: 'red'}} 
						className='payment-selection-icon' 
						onClick={() => props.showModal('CARD_PAYMENT_MODAL', {})}
					>
						<img src='/assets/icons/credit-card.svg' />
					</div>
					<div 
						style={{width: 56, height: 56, borderRadius:30, backgroundColor: 'red'}} 
						className='payment-selection-icon' 
						onClick={() => props.showModal('CASH_PAYMENT_MODAL', {})}
					>
						<img src='/assets/icons/change.svg' />
					</div>
				</div>
				<button onClick={() => props.hideModal()}> Cancel </button>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentTypeSelectionModal)