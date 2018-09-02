import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle3 } from '../config';
import { hideModal } from '../../actions/modals';

import AuthenticationForm from '../forms/registration/AuthenticationForm';

const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
})

const mapStateToProps = (state) => {
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps }
}

const AuthModal = props => {
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'AUTH_FORM_MODAL'}
				style={modalStyle3}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				>
				<AuthenticationForm {...props} />
			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal)