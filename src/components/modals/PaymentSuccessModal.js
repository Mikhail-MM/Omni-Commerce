import React, { Component } from 'react';
import { connect } from 'react-redux';


import Modal from 'react-modal';
import { modalStyle3, fullScreenMobileModal, modalStyleanim } from '../config';
import { hideModal } from '../../actions/modals';



const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
})

const mapStateToProps = (state) => {
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps }
}

class PaymentSuccess extends Component {
	
	render() {
		return(
			<div>
					<Modal
						isOpen={this.props.modalType === 'PAYMENT_CONFIRMATION_MODAL'}
						style={modalStyle3}
						contentLabel="Example Modal"
						overlayClassName="Overlay"
						>
						<div style={{display: 'flex', flexDirection: 'column'}}>
							<h4> Payment Successful! </h4>
							<h5> Payment Type: {this.props.mode} </h5>
							{
								(this.props.mode === 'Cash') &&
									<div>
										<h6> Cash Paid:  ${`${this.props.payment.payment.cashTenderedByCustomer}`} </h6>
										<h6> Refund Due: ${`${this.props.payment.payment.refund}`} </h6>
									</div>
							}
							<button onClick={() => this.props.hideModal()}> Close </button>
						</div>
					</Modal>
			</div>
		)}
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSuccess)