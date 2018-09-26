import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'underscore'

import Modal from 'react-modal';
import { modalStyle, modalStyleanim, modalStyleFadeout, fullScreenMobileModal } from '../config';
import { hideModal } from '../../actions/modals';

import RegistrationPicker from '../forms/RegistrationPicker'

const mapStateToProps = state => {
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps }
}
const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
})

class RegistrationModulePickerModal extends Component {
	state = { 
		handleClose: false, 
		viewportWidth: window.innerWidth
	}

	componentDidMount() {
		window.addEventListener('resize', this.throttledListener)
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.throttledListener)
	}
	
	handleViewportChange = (event) => {
		this.setState({
			viewportWidth: event.target.innerWidth
		})
	}

	throttledListener = throttle(this.handleViewportChange, 500)

	animateFade = () => {
		if (this.state.viewportWidth <= 800) return this.props.hideModal()

		this.setState({
			handleClose: true
		})
		setTimeout(() => {
			this.props.hideModal()
			this.setState({
				handleClose: false
			})}, 1100)
	}

	render(){
	return(
		<div>
			<Modal
				isOpen={this.props.modalType === 'REGISTRATION_MODULE_PICKER'}
				style={(this.state.viewportWidth <= 800) ? fullScreenMobileModal : (this.state.handleClose) ? modalStyleFadeout : modalStyleanim }
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				>
				<RegistrationPicker animateFade={this.animateFade}/>

			</Modal>
		</div>
	)}
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationModulePickerModal)