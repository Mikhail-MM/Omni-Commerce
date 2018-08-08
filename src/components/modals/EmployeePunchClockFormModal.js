import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import ClockInOutForm from '../forms/ClockInOutForm'

const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal())
})

const mapStateToProps = state => {
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps }
}

const EmployeePunchClockFormModal = props => {
	const { modalProps } = props
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'EMPLOYEE_PUNCH_CLOCK_FORM_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				>
					<div>
						{ (modalProps.formSelector === "Clock In" ) && <ClockInOutForm option={modalProps.formSelector}/> }
						{ (modalProps.formSelector === "Clock Out" ) && <ClockInOutForm option={modalProps.formSelector}/> }
						<button onClick={() => props.hideModal()}> Cancel </button>
					</div>
			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeePunchClockFormModal)