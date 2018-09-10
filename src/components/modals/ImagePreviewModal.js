import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle, modalStyleanim, modalStyleFadeout, modalStylePopIn } from '../config';
import { hideModal } from '../../actions/modals';

import RegistrationPicker from '../forms/RegistrationPicker'

const mapStateToProps = state => {
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps }
}
const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
})

const Animation_Map = {
	fadeInFromBottom: modalStyleanim,
	scaleIn: modalStylePopIn,
}

class ImagePreviewModal extends Component {
	/* state = { handleClose: false }

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
	*/

	render(){
	return(
		<div>
			<Modal
				isOpen={this.props.modalType === 'IMAGE_PREVIEW_MODAL'}
				style={Animation_Map[this.props.animationKey]}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				>
				<div style={{width: (window.innerWidth / 2), height: 'auto'}}>
					<img src={this.props.imageSourceString} />
				</div>

			</Modal>
		</div>
	)}
}

export default connect(mapStateToProps, mapDispatchToProps)(ImagePreviewModal)