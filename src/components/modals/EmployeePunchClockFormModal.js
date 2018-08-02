import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import ClockInOutForm from './ClockInOutForm'

import { hideModal } from '../../actions/modals'

import { modalStyle } from '../config'

const mapDispatchToProps = (dispatch) => ({
	hideModal: () => dispatch(hideModal())
})

const mapStateToProps = (state) => {
	const { modalType } = state.modalReducer
	return { modalType }
}

const EmployeePunchClockFormModal = props => {
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'EMPLOYEE_PUNCH_CLOCK_FORM_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				>
					<div>
						{ (props.formSelector === "Clock In" ) && <ClockInOutForm option={formSelector}/> }
						{ (props.formSelector === "Clock Out" ) && <ClockInOutForm option={formSelector}/> }
						<button fluid color='black' onClick={() => this.props.hideModal()}> Cancel </button>
					</div>
			</Modal>
		</div>
	)
}

export default connect(mapStateToProps)(EmployeePunchClockFormModal)