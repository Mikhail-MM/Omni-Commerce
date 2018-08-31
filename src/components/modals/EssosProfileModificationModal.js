import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';
import { updateEssosProfileData } from '../../actions/users'

const mapDispatchToProps = dispatch => ({
	editProfileData: (token, userID, data, imageHandler) => dispatch(updateEssosProfileData(token, userID, data, imageHandler)), 
	hideModal: () => dispatch(hideModal()),
})

const mapStateToProps = (state) => {
	const { modalType, modalProps } = state.modalReducer
	const { token } = state.authReducer
	return { modalType, modalProps, token}
}

class EssosProfileModificationModal extends Component {
	
	state = {
		email: '',
		firstName: '',
		lastName: '',
		phone: '',
		billing_address_line1: '',
		billing_address_line2: '',
		billing_address_city: '',
		billing_address_zip: '',
		billing_address_state: '',
		shipping_address_line1: '',
		shipping_address_line2: '',
		shipping_address_city: '',
		shipping_address_zip: '',
		shipping_address_state: '',
		imageSource: '',
		imageRAWFILE: null,
		newImageFlag: false,

	}

	componentDidMount() {
		
		const { 
			email,
			firstName,
			lastName,
			phone,
			billing_address_line1,
			billing_address_line2,
			billing_address_city,
			billing_address_zip,
			billing_address_state,
			shipping_address_line1,
			shipping_address_line2,
			shipping_address_city,
			shipping_address_zip,
			shipping_address_state,
			avatarURL,
		} = this.props.profileData

		this.setState({
			email,
			firstName,
			lastName,
			phone,
			billing_address_line1,
			billing_address_line2,
			billing_address_city,
			billing_address_zip,
			billing_address_state,
			shipping_address_line1,
			shipping_address_line2,
			shipping_address_city,
			shipping_address_zip,
			shipping_address_state,
			imageSource: avatarURL,
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
			email, 
			firstName, 
			lastName,
			phone,
			billing_address_line1,
			billing_address_line2,
			billing_address_city,
			billing_address_zip,
			billing_address_state,
			shipping_address_line1,
			shipping_address_line2,
			shipping_address_city,
			shipping_address_zip,
			shipping_address_state,
			imageSource,
			imageRAWFILE,
			newImageFlag,
		} = this.state
		const data = {
			email, 
			firstName, 
			lastName,
			phone,
			billing_address_line1,
			billing_address_line2,
			billing_address_city,
			billing_address_zip,
			billing_address_state,
			shipping_address_line1,
			shipping_address_line2,
			shipping_address_city,
			shipping_address_zip,
			shipping_address_state,
		}
		const imageHandler = {
			imageSource,
			imageRAWFILE,
			newImageFlag,
		}

			this.props.editProfileData(token, this.props.profileData._id, data, imageHandler)
	}

	render() {
		return(
			<div>
			<Modal
				isOpen={this.props.modalType === 'MODIFY_ESSOS_PROFILE_SETTINGS'}
				style={modalStyle}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
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
						<div className='form-label-input-container' style={{width: '70%', height: 'auto'}}>
							<label> Billing Address </label>
							<input 
								type='text'
								value={this.state.billing_address_line1}
								onChange={(e) => this.handleChange('billing_address_line1', e.target.value)}
							/>
						</div>
						<div className='form-label-input-container' style={{width: '30%', height: 'auto'}}>
							<label> Line 2 </label>
							<input 
								type='text'
								value={this.state.billing_address_line2}
								onChange={(e) => this.handleChange('billing_address_line2', e.target.value)}
							/>
						</div>
					</div>

					<div className='essos-reg-form-row'>
						<div className='form-label-input-container' style={{width: '55%', height: 'auto'}}>
							<label> City </label>
							<input 
								type='text'
								value={this.state.billing_address_city}
								onChange={(e) => this.handleChange('billing_address_city', e.target.value)}
							/>
						</div>
						<div className='form-label-input-container' style={{width: '20%', height: 'auto'}}>
							<label> State </label>
							<input 
								type='text'
								value={this.state.billing_address_state}
								onChange={(e) => this.handleChange('billing_address_state', e.target.value)}
							/>
						</div>
						<div className='form-label-input-container' style={{width: '25%', height: 'auto'}}>
							<label> Zip Code </label>
							<input 
								type='text'
								value={this.state.billing_address_zip}
								onChange={(e) => this.handleChange('billing_address_zip', e.target.value)}
							/>
						</div>
					</div>

					<div className='essos-reg-form-row'>
						<div className='form-label-input-container' style={{width: '70%', height: 'auto'}}>
							<label> Shipping Address </label>
							<input 
								type='text'
								value={this.state.shipping_address_line1}
								onChange={(e) => this.handleChange('shipping_address_line1', e.target.value)}
							/>
						</div>
						<div className='form-label-input-container' style={{width: '30%', height: 'auto'}}>
							<label> Line 2 </label>
							<input 
								type='text'
								value={this.state.shipping_address_line2}
								onChange={(e) => this.handleChange('shipping_address_line2', e.target.value)}
							/>
						</div>
					</div>

					<div className='essos-reg-form-row'>
						<div className='form-label-input-container' style={{width: '55%', height: 'auto'}}>
							<label> City </label>
							<input 
								type='text'
								value={this.state.shipping_address_city}
								onChange={(e) => this.handleChange('shipping_address_city', e.target.value)}
							/>
						</div>
						<div className='form-label-input-container' style={{width: '20%', height: 'auto'}}>
							<label> State </label>
							<input 
								type='text'
								value={this.state.shipping_address_state}
								onChange={(e) => this.handleChange('shipping_address_state', e.target.value)}
							/>
						</div>
						<div className='form-label-input-container' style={{width: '25%', height: 'auto'}}>
							<label> Zip Code </label>
							<input 
								type='text'
								value={this.state.shipping_address_zip}
								onChange={(e) => this.handleChange('shipping_address_zip', e.target.value)}
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

export default connect(mapStateToProps, mapDispatchToProps)(EssosProfileModificationModal)