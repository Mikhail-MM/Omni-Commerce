import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment'

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';


const mapStateToProps = state => {
	const { modalType, modalProps } = state.modalReducer
	const { salesReport } = state.salesReportReducer
		return { modalType, modalProps, salesReport }
}

const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
})

const SalesAggregationSuccessModal = props => {
	const { salesReport } = props
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'END_OF_BUSINESS_DAY_SUCCESS'}
				style={modalStyle}
				contentLabel="Example Modal"
				>

				<div>
					<div>
						<h5> {moment(salesReport.endDate).format('MMMM Do YYYY, h:mm:ss a')} </h5>
						<h2> End of Day </h2>
					</div>
					<div>
						<h6> Today's Gross </h6>
						<h4> {salesReport.gross} </h4>
					</div>
					<button onClick={() => props.hideModal()}> Cancel </button>
				</div>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesAggregationSuccessModal)