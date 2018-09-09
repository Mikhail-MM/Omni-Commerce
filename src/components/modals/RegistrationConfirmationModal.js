import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyleanim } from '../config';
import { showModal, hideModal } from '../../actions/modals';


const mapStateToProps = state => {
	const { modalType, modalProps } = state.modalReducer
		return { modalType, modalProps }
}

const mapDispatchToProps = dispatch => ({
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
	hideModal: () => dispatch(hideModal()),
})

const RegistrationConfirmationModal = props => {
	const { user, mode } = props
	
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'REGISTRATION_CONFIRMATION_MODAL'}
				style={{...modalStyleanim, height:'500px', overflow: 'hidden', position: 'fixed', top: 0, right: 0, bottom: 0, left: 0,}}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				htmlOpenClassName='ReactModal__Html--open'
				>
				<div>
					<h3> Registration Successful! </h3>
					<p> Thanks for registering, {user.firstName}. A confirmation E-mail has been sent to {user.email}. Remember the e-mail you signed up with and your password to log-in! </p>
					<p>
						{(mode === 'essos-user') ? 'Essos Marketplace' : 'Omni Commerce'} 
							is a 
						{(mode === 'essos-user') ? 
							'Online Store Builder and where you can make money by selling items through your store profile. You can also browse the market to make puchases from other Merchants.'
						:
							'Business Management Solution that can be used as a Point-of-Sale terminal for your retail business and an as online employee management platform to track real-time business metrics.'
						}
					</p>
					<p> You can log in now. </p>
					<button 
						onClick={() => props.showModal('AUTH_FORM_MODAL', {
							login: true, 
							loginEssos: `${(mode === 'essos-user') ? true : false}`,
							loginOmni: `${(mode === 'omni-child') ? true : false}`,
						})}
					> 
						Log In 
					</button>
				<button onClick={() => props.hideModal()}> Cancel </button>
				</div>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationConfirmationModal)