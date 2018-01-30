import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

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

function mapStateToProps(state) = {
	const { modalType } = state.modalReducer
	return { modalType }
}

class ExampleModal extends Component {
	constructor(props){
		super(props);
		this.state = {}

		this.hideModal = this.hideModal.bind(this)
	}

	deactivateModal() {
		dispatch(hideModal())
	}

	render(){
		// This can be moved to the actual component's props instead of a redux connection to avoid perf hit

		const { modalType } = this.props
		
		return(
			<div>
				<Modal
					isOpen={modalType === 'EXAMPLE_MODAL'}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<div> I am just a modal! An example one, at that...</div>
					<button onClick={this.deactivateModal}> Get rid of this nonsense! </button>
				</Modal>
			</div>
		)

	}

}

export default connect(mapStateToProps)(ExampleModal)