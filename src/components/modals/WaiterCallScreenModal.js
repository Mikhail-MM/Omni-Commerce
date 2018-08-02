import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import { createNewTicket } from '../actions/tickets-transactions';

const mapDispatchToProps = dispatch => ({

	hideModal: () => dispatch(hideModal()),
	createNewTicket: (token, employeeName) => dispatch(createNewTicket(token, employeeName)),

});

const mapStateToProps = state => {

	const { token } = state.authReducer
	const { loggedInUsers } = state.employeeReducer
	const { modalType } = state.modalReducer

	return { token, loggedInUsers, modalType }
};

const WaiterCallScreenMenu = props => {
	
	const generateWaiterCallScreen = () => {
		if (props.loggedInUsers) return loggedInUsers.map(employee => <button key={employee} onClick={props.createNewTicket(props.token, employee)}> {employee} </button>)
	}

	return(
		<div>
			{ props.loggedInUsers && generateWaiterCallScreen() }
		</div>
	)
}

const WaiterCallScreenModal = props => {
	const { token, loggedInUsers, createNewTicket } = props
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'SELECT_EMPLOYEE_OPENING_TICKET'}
				style={modalStyle}
				contentLabel="Employee Manifest"
				>
				<WaiterCallScreenMenu token={token} loggedInusers={loggedInUsers} createNewTicket={createNewTicket}/>
				<button fluid color='black' onClick={() => this.props.hideModal()}> Cancel </button>
			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(WaiterCallScreenModal)