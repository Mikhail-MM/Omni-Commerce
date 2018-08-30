import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';
import { deleteMarketplaceItem } from '../../actions/marketplace'
import { deleteTerminalItem } from '../../actions/terminalItems'

const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
	deleteEssosItem: (token, itemID) => dispatch(deleteMarketplaceItem(token, itemID)),
	deleteOmniItem: (token, itemID) => dispatch(deleteTerminalItem(token, itemID)),
})

const mapStateToProps = (state) => {
	const { token } = state.authReducer
	const { modalType, modalProps } = state.modalReducer
	return { token, modalType, modalProps }
}

const ConfirmDeletionModal = props => {
	console.log(props)
	const { itemData, module, token } = props
	const handleDeleteRequest = () => {
		if (module === 'Essos')  { 
			return props.deleteEssosItem(token, itemData._id) 
		} else if (module === 'Omni') {
			return props.deleteOmniItem(token, itemData._id)
		}
	}

	return(
		<div>
			<Modal
				isOpen={props.modalType === 'CONFIRM_DELETE_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				>
				<div>
					<h2> 
						{`Confirm Deletion of  ${itemData.itemName} .`}
					</h2>
					<button onClick={() => handleDeleteRequest()}> Delete Item </button>
					<button onClick={() => props.hideModal()}> Cancel </button>
				</div>
			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDeletionModal)