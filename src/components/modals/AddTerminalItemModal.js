import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import AddTerminalItemForm from '../forms/AddTerminalItemForm'

const mapDispatchToProps = (dispatch) => ({
	hideModal: () => dispatch(hideModal())
})

const mapStateToProps = (state) => {
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps }
}

const AddTerminalItemModal = props => {
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'ADD_POINT_SALE_ITEM'}
				style={modalStyle}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				shouldCloseOnOverlayClick={true}
				onRequestClose={() => props.hideModal()}
				>

				<AddTerminalItemForm />
				<button onClick={() => props.hideModal()}> Cancel </button>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTerminalItemModal)
