import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Segment, Button } from 'semantic-ui-react'

import Modal from 'react-modal';
import AddMarketplaceItemForm from './AddMarketplaceItemForm'

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

class AddMarketplaceItemModal extends Component {
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
		
		return(
			<div>
				<Modal
					isOpen={modalType === 'ADD_MARKETPLACE_ITEM'}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<AddMarketplaceItemForm />
					<Button fluid color='black' onClick={this.deactivateModal}> Cancel </Button>
				</Modal>
			</div>
		)

	}

}

export default connect(mapStateToProps)(AddMarketplaceItemModal)