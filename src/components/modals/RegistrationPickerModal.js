import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle, modalStyleanim, modalStyleFadeout } from '../config';
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
	state = { handleClose: false }

	animateFade = () => {
		this.setState({
			handleClose: true
		})
		setTimeout(() => {
			this.props.hideModal()
			this.setState({
				handleClose: false
			})}, 2000)
	}

	render(){
	return(
		<div>
			<Modal
				isOpen={this.props.modalType === 'REGISTRATION_MODULE_PICKER'}
				style={(this.state.handleClose) ? modalStyleFadeout : modalStyleanim}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				>
				<RegistrationPicker animateFade={this.animateFade}/>

			</Modal>
		</div>
	)}
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationModulePickerModal)