import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import Modal from 'react-modal';

import { Segment } from 'semantic-ui-react'

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
			// Still need to differentiate modalProps POS for permission based registration
		return(	
			<Modal
				isOpen={modalType === 'REGISTRATION_CONFIRMATION_MODAL'}
				style={customStyles}
				contentLabel="Invalid Cart"
			>
				{ this.props.registrationModalMode === "PointOfSale" &&
				  this.props.createdClient.isMaster && 
				<Segment>
					<h1>Company Registered!</h1>
					<p>Thanks for registering with us, {this.props.createdClient.firstName}. </p>
					<p>We have sent you some more information about Omni-Commerce to your email at {this.props.createdClient.email}. </p>
					<p>Using this account, you can invite managers and employees into the system and keep track of the health of your business by running sales analytics and seeing which items are performing well! </p>
					<p>You can also set up a public terminal account for all users to log into and input orders through a PC terminal or mobile device. </p>
					<p>After you configure your account by setting up some menu items to sell, you will be ready to accept payments! Thank you for doing business with Omni. </p>
					<button onClick={this.deactivateModal}> Confirm </button>
				</Segment> }

				{ this.props.registrationModalMode === "PointOfSale" &&
				  !this.props.createdClient.isMaster &&
				  <Segment>
				  	<h1>Employee Registration Successful! </h1>
				  	<p> Thanks for registering with us, {this.props.createdClient.firstName}. </p>
				  	<p> Once your employer confirms your credentials, you'll be able to log in and use Omni! </p>
				  </Segment>
				}
				{ this.props.registrationModalMode === "Marketplace" && 
					<Segment>
						<h1> Marketplace Registration Successful!</h1>
						<p> Thanks for registering with us, {this.props.createdClient.firstName}! </p>
						<p> We've sent you an e-mail to confirm your account at {this.props.createdClient.email} </p>
						<p> Your store, {this.props.createdMarketplace.storeName} has been added to the Omni marketplace browser. </p>
						<p> Once you add some items to your marketplace, you'll be able to sell items and accept payments from other Omni users </p>
						<p> After you confirm your account, your store will be ready for business </p>
						<button onClick={this.deactivateModal}> Confirm </button>
					</Segment>
				}
			</Modal>
			
		)
	}

}

export default connect(mapStateToProps)(RegistrationConfirmationModal)