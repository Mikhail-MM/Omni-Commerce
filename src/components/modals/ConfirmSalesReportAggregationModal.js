import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import { fetchAllTicketsAndGenerateSalesReport } from '../../actions/sales-reporting'

const mapStateToProps = state => {
	
	const { token } = state.authReducer
	return { token }

}

const mapDispatchToProps = dispatch => ({

	closeOutDailySales: (token) => dispatch(fetchAllTicketsAndGenerateSalesReport(token)),
	hideModal: () => dispatch(hideModal()),

})

const ConfirmSalesReportAggregationModal = props => {
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'CARD_PAYMENT_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				>

				<div>
					<div>
						<h2> Confirm End of Sales Period </h2>
					</div>
					<div>
						<p> 
							This action will collect all transactions within this sales period. If you have any open tickets, please ensure that they are paid out. All unpaid tickets will be considered void.  
						</p>
						<p>
							You will not be able to edit these transactions after they have been collected without administrative approval. 
						</p>
						<button onClick={() => props.closeOutDailySales(props.token)} > Confirm </button>
					</div>
					<button onClick={() => props.hideModal()}> Cancel </button>
				</div>

			</Modal>
		</div>
	)
}

export default connect(null, mapDispatchToProps)(ConfirmSalesReportAggregationModal)