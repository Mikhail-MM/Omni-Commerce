import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import UploadItemForm from '../forms/UploadItemForm';

const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
})

const mapStateToProps = (state) => {
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps }
}

const DatabaseInterfaceModal = props => {
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'DATABASE_INTERFACE_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				>
				<UploadItemForm {...props} />
				<button onClick={() => props.hideModal()}> Cancel </button>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseInterfaceModal)