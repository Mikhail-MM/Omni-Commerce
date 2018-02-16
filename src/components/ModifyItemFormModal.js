import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Segment, Button } from 'semantic-ui-react'

import Modal from 'react-modal';
import ModifyItemForm from './ModifyItemForm'

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

class ModifyItemFormModal extends Component {
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

		const { modalType } = this.props
		
		return(
			<div>
				<Modal
					isOpen={modalType === 'MODIFY_ITEM_FORM_MODAL'}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<ModifyItemForm />
					<Button fluid color='black' onClick={this.deactivateModal}> Cancel </Button>
				</Modal>
			</div>
		)

	}

}

export default connect(mapStateToProps)(ModifyItemFormModal)