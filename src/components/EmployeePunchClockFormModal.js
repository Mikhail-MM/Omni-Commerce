import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Segment, Button } from 'semantic-ui-react'

import Modal from 'react-modal';
import ClockInOutForm from './ClockInOutForm'

import { hideModal } from '../actions/modals'

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	}
};

function mapStateToProps(state) {
	const { modalType } = state.modalReducer
	return { modalType }
}

class WaiterCallScreenModal extends Component {
	constructor(props){
		super(props);
		this.state = {}

		this.deactivateModal = this.deactivateModal.bind(this)
	}

	deactivateModal() {
		const { dispatch } = this.props
		dispatch(hideModal())
	}

	render(){
		// This can be moved to the actual component's props instead of a redux connection to avoid perf hit

		const { modalType } = this.props
		const { formSelector } = this.props
		
		return(
			<div>
				<Modal
					isOpen={modalType === 'EMPLOYEE_PUNCH_CLOCK_FORM_MODAL'}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<Segment raised>
					{ (formSelector === "Clock In" ) && <ClockInOutForm option={formSelector}/> }
					{ (formSelector === "Clock Out" ) && <ClockInOutForm option={formSelector}/> }
					<Button color='black' onClick={this.deactivateModal}> Cancel </Button>
					</Segment>
				</Modal>
			</div>
		)

	}

}

export default connect(mapStateToProps)(WaiterCallScreenModal)