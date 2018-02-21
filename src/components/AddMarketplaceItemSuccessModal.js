import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button } from 'semantic-ui-react'
import Modal from 'react-modal';
import { hideModal } from '../actions/modals'
import ItemPreviewCard from './ItemPreviewCard'

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

class AddMarketplaceItemSuccessModal extends Component {
	constructor(props){
		super(props)
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
					isOpen={modalType === 'ADD_MARKETPLACE_ITEM_SUCCESS'}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<ItemPreviewCard parentProps={{ ...this.props }}/>
					<Button fluid color='black' onClick={this.deactivateModal}> Cancel </Button>
				</Modal>
			</div>
		)

	}
}

export default connect(mapStateToProps)(AddMarketplaceItemSuccessModal)