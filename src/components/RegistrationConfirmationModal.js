import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import Modal from 'react-modal';

import { hideModal } from '../actions/modals'

// can export to a config
const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		maxWidth: 600,
		textAlign: 'center',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	}
};

function mapStateToProps(state) {
	const { modalType } = state.modalReducer
	return { modalType }
}


class RegistrationConfirmationModal extends Component {
	constructor(props) {
		super(props)
		this.deactivateModal = this.deactivateModal.bind(this)
	}
	deactivateModal() {
		const { dispatch } = this.props
		dispatch(hideModal())
		dispatch(push('/login'))
		
	}

	componentDidMount() {
		console.log("Ensure that all props have been passed in from the handler: ")
		console.log(this.props)
	}

	render() {
		const { modalType } = this.props
		// Split this into 2 components which give conditional messages to be re-used in different registration
		// Via ModalProps
		return(	
			<Modal
				isOpen={modalType === 'REGISTRATION_CONFIRMATION_MODAL'}
				style={customStyles}
				contentLabel="Invalid Cart"
			>
				<h1>Registration Successful!</h1>
				<p>Thanks for registering with us, {this.props.json.createdClient.firstName}. </p>
				<p>We have sent you some more information about Omni-Commerce to your email at {this.props.json.createdClient.email}. </p>
				<p>Using this account, you can invite managers and employees into the system and keep track of the health of your business by running sales analytics and seeing which items are performing well! </p>
				<p>You can also set up a public terminal account for all users to log into and input orders through a PC terminal or mobile device. </p>
				<p>After you configure your account by setting up some menu items to sell, you will be ready to accept payments! Thank you for doing business with Omni. </p>
				<button onClick={this.deactivateModal}> Confirm </button>
			</Modal>
			
		)
	}

}

export default connect(mapStateToProps)(RegistrationConfirmationModal)