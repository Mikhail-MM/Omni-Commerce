import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

const CashPaymentModal = props => {
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'CASH_PAYMENT_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				>

				<AddTerminalItemForm />
				<button color='black' onClick={() => this.props.hideModal()}> Cancel </button>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(CashPaymentModal)