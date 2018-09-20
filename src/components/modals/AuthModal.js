import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'underscore'


import Modal from 'react-modal';
import { modalStyle3, fullScreenMobileModal, modalStyleanim } from '../config';
import { hideModal } from '../../actions/modals';

import AuthenticationForm from '../forms/registration/AuthenticationForm';

import MediaQuery from 'react-responsive'


const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
})

const mapStateToProps = (state) => {
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps }
}

class AuthModal extends Component {
	
	state = {
		viewportWidth: window.innerWidth
	}

	componentDidMount() {
		window.addEventListener('resize', throttle((event) => {
			this.setState({viewportWidth:event.target.innerWidth})		
		}, 500))
	}
	
	componentWillUnmount() {
		window.addEventListener('resize', throttle((event) => {
			this.setState({viewportWidth:event.target.innerWidth})		
		}, 500))
	}

	render() {
		return(
			<div>
					<Modal
						isOpen={this.props.modalType === 'AUTH_FORM_MODAL'}
						style={(this.state.viewportWidth <= 800) ? fullScreenMobileModal : modalStyleanim}
						contentLabel="Example Modal"
						overlayClassName="Overlay"
						>
						<AuthenticationForm {...this.props} />
					</Modal>
			</div>
		)}
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal)