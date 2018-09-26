import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import { updateProfileData } from '../../actions/users'

const mapDispatchToProps = dispatch => ({
	editProfileData: (token, userID, data, imageHandler) => dispatch(updateProfileData(token, userID, data, imageHandler, 'Omni')), 
	hideModal: () => dispatch(hideModal()),
})

const mapStateToProps = (state) => {
	const { modalType, modalProps } = state.modalReducer
	const { token } = state.authReducer
	return { modalType, modalProps, token}
}

class OmniProfileModificationModal extends Component {
	
	state = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		role: '',
		imageSource: null,
		imageRAWFILE: null,
		newImageFlag: false
	}

	componentDidMount() {
		const { 
			firstName,
			lastName,
			email,
			phone,
			role,
			avatarURL,
		} = this.props.profileData

		this.setState({
			firstName,
			lastName,
			email,
			phone,
			role,
			imageSource: avatarURL
		})

	}

	handleChange = (key, value) => {
		this.setState({
			[key]: value
		})
	}

	imageSelectedHandler = (event) => {
		const blobURL = URL.createObjectURL(event.target.files[0])
		this.setState({
			imageSource: blobURL,
			imageRAWFILE: event.target.files[0],
			newImageFlag: true
		})
	}

	handleSubmit = (e) => {
		e.preventDefault()
		const { token } = this.props
		const { 
			firstName,
			lastName,
			email,
			phone,
			role,
			imageSource,
			imageRAWFILE,
			newImageFlag,
		} = this.state

		const data = {
			firstName,
			lastName,
			email,
			phone,
			role,
		}
		const imageHandler = {
			imageSource,
			imageRAWFILE,
			newImageFlag,
		}
			// NEED TO ADD DIFFERENT ACTIONS FOR CREATE NEW USER/MODIFY USER
			this.props.editProfileData(token, this.props.profileData._id, data, imageHandler)
	}

	render() {
		return(
			<div>
			<Modal
				isOpen={this.props.modalType === 'OMNI_EMPLOYEE_MANAGEMENT_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				shouldCloseOnOverlayClick={true}
				onRequestClose={() => this.props.hideModal()}
				>	
				<form className='essos-profile-edit-form' onSubmit={(e) => this.handleSubmit(e)}>
					<div className='avatar-selection-container'>
						<h4> Change Avatar </h4>
						<div className='essos-avatar-preview-container' >
							<img src={this.state.imageSource} />
						</div>
						<div>
							<input 
								type='file'
								name='avatar'
								onChange={(e) => this.imageSelectedHandler(e)}
							/>
						</div>
					</div>
					<div className='essos-reg-form-row'>
						<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
							<label> First Name </label>
							<input 
								type='text'
								value={this.state.firstName}
								onChange={(e) => this.handleChange('firstName', e.target.value)}
							/>
						</div>
						<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
							<label> Last Name </label>
							<input 
								type='text'
								value={this.state.lastName}
								onChange={(e) => this.handleChange('lastName', e.target.value)}
							/>
						</div>
					</div>

					<div className='essos-reg-form-row'>
						<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
							<label> E-Mail </label>
							<input 
								type='text'
								value={this.state.email}
								onChange={(e) => this.handleChange('email', e.target.value)}
							/>
						</div>
						<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
							<label> Phone Number </label>
							<input 
								type='text'
								value={this.state.phone}
								onChange={(e) => this.handleChange('phone', e.target.value)}
							/>
						</div>
					</div>

					<div className='essos-reg-form-row'>
						<div className='form-label-input-container' style={{width: '100%', height: 'auto'}}>
							<label> Role </label>
							<input 
								type='text'
								value={this.state.role}
								onChange={(e) => this.handleChange('role', e.target.value)}
							/>
						</div>
					</div>

					<input type='submit' />
					<button onClick={() => this.props.hideModal()}> Cancel </button>
				</form>
			</Modal>
		</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OmniProfileModificationModal)