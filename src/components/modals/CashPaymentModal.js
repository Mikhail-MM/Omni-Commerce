import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import { sendCashPaymentToApi } from '../../actions/payments'

const mapStateToProps = state => {
	
	const authToken = state.authReducer.token
	const { activeTicket } = state.ticketTrackingReducer
	const { modalType, modalProps } = state.modalReducer
	return { authToken, activeTicket, modalType, modalProps }

}

const mapDispatchToProps = dispatch => ({
	sendCashPaymentToApi: (authToken, amount, transactionId) => {
		dispatch(sendCashPaymentToApi(authToken, amount, transactionId))
	},
	hideModal: () => dispatch(hideModal()),
})

// Note: Can export all redux logic to the Form and disconnect Modals from mapping state to props and passing them down

class CashPaymentForm extends Component {
	// !! Validations Required !! // 
	state = {
		amount: ''
	}

	handleChange = (event) => {
		this.setState({
			amount: event.target.value
		})
	}

	handleSubmit = (event, authToken, amount, transactionId) => {
		// Throw error if amount is a string or empty 
		event.preventDefault()
		this.props.sendCashPaymentToApi(authToken, amount, transactionId)
	}
	render() {
		const { authToken, activeTicket } = this.props
		
		return(
			<form onSubmit={(event) => this.handleSubmit(event, authToken, this.state.amount, activeTicket._id)}>
				<label>
					Cash Tendered By Customer (Dollars):
					<input type='text' value={this.state.amount} onChange={(event) => this.handleChange(event)} />
				</label>
				<input type='submit' value='Submit Customer Cash Paid' />
			</form>
		)
	}
}

const CashPaymentModal = props => {

	const { authToken, activeTicket } = props
	const { sendCashPaymentToApi } = props

	return(
		<div>
			<Modal
				isOpen={props.modalType === 'CASH_PAYMENT_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				>

				<CashPaymentForm 
					authToken={authToken} 
					activeTicket={activeTicket} 
					sendCashPaymentToApi={sendCashPaymentToApi}
				/>
				<button onClick={() => props.hideModal()}> Cancel </button>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(CashPaymentModal)
