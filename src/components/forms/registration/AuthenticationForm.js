import React, { Component } from 'react'
import { connect } from 'react-redux'

import { stockAvvys } from '../../config'
import '../../styles/RegistrationForms.css'

import { attemptLogIn, attemptRegistration } from '../../../actions/auth'

const mapStateToProps = state => {
	const { token } = state.authReducer

	return { token }
}

const mapDispatchToProps = dispatch => ({
	attemptLogin: (credentials) => dispatch(attemptLogIn(credentials)),
	registerUser: (token, data, imageHandler, mode) =>  dispatch(attemptRegistration(token, data, imageHandler, mode)),

})


class AuthenticationForm extends Component {
	state = {
		email: '',
		password: '',
		confpass: '',
		firstName: '',
		lastName: '',
		role: '',
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
		imageSource: stockAvvys[0],
		avvyIndex: 0,
		imageRAWFILE: null,
		newImageFlag: false,
		registrationPage: 1,
	}

	handleChange = (key, value) => {
		this.setState({
			[key]:value
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

	validateFormData = () => {
		// source: (http://emailregex.com/)
		const emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
		
		if ((this.props.regpathOmniMaster || this.props.regpathEssos) && (!this.state.email || !this.state.password || !this.state.confpass)) return console.log("Please fill out missing fields")
		
		if (!emailRegex.test(this.state.email)) return console.log("Error, Enter a valid e-mail.")
		
		
		if ((this.props.regpathOmniMaster || this.props.regpathEssos) && (this.state.password !== this.state.confpass)) return console.log("Passwords do not match")
		
		return true
	}


	handleSubmit = (event) => {
		event.preventDefault()
		const { email, firstName, lastName, phone, password, imageSource, imageRAWFILE, newImageFlag } = this.state
		const { billing_address_line1, billing_address_line2, billing_address_city, billing_address_zip, billing_address_state, shipping_address_line1, shipping_address_line2, shipping_address_city, shipping_address_zip, shipping_address_state } = this.state
		const imageHandler = {
			imageSource,
			imageRAWFILE,
			newImageFlag,
		}
		if (this.validateFormData()) {
			console.log("Truth Received")
		}
		if (this.props.loginOmni) return this.handleLogin('omni')
		if (this.props.loginEssos) return this.handleLogin('essos')
		if (this.props.regpathOmniMaster) {
			const data = {
				email,
				firstName,
				lastName,
				phone,
				password
			}
				return this.props.registerUser(null, data, imageHandler, 'omni-master')
		}
		if (this.props.regpathEssos) {
			const data = {
				email,
				firstName,
				lastName,
				phone,
				password,
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
				return this.props.registerUser(null, data, imageHandler, 'essos-user') 
		}

		if (this.props.regpathOmniChild) {
			const data = {
				email,
				firstName,
				lastName,
				phone,
				password,
			}
			const { token } = this.props
			this.props.registerUser(token, data, imageHandler, 'omni-child') 
		} 

	}

	handleLogin = (pathway) => {
		const credentials = {
			
			email: this.state.email,
			password: this.state.password,
			loginPath: pathway,

		}
		console.log(credentials)
		return this.props.attemptLogin(credentials)

	}

	handleRegistration = (pathway) => {
		const credentials = {

			...this.state,
			token: this.props.token,
			registrationPath: pathway

		}

		return this.props.attemptRegistration(credentials)
	}

	randomizeIndex = (arrayLength) => {
		return Math.floor(Math.random() * Math.floor(arrayLength))

	}
	randomizeAvvy = (e) => {
		e.preventDefault()
		let randIndex = this.randomizeIndex(stockAvvys.length - 1)
		console.log(randIndex)

		this.setState((prevState) => {
			return ({
				imageSource: stockAvvys[randIndex],
				avvyIndex: randIndex,
				newImageFlag: false,
			})
		})
	}
	renderEssosStepper = () => {
		switch(this.state.registrationPage) {
			case 1: {
				return(
					<React.Fragment>
					<div className='avatar-selection-container'>
						<h4> Change Avatar </h4>
						<div className='essos-avatar-preview-container' >
							<img src={this.state.imageSource} />
						</div>
							<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
								<button type='button' onClick={(e) => this.randomizeAvvy(e)}> Randomize Avatar </button>
							</div>
							<h4> OR </h4>
							<div className='form-label-input-container' style={{width: '50%', height: 'auto', alignItems:'center', justifyContent: 'center'}}>
								<label> Select a Profile Picture Instead </label>
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
								className='form-input' 
								type='text'
								value={this.state.firstName}
								onChange={(e) => this.handleChange('firstName', e.target.value)}
							/>
						</div>
						<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
							<label> Last Name </label>
							<input
								className='form-input' 
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
										className='form-input' 
										type='text'
										value={this.state.email}
										onChange={(e) => this.handleChange('email', e.target.value)}
									/>
								</div>
								<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
									<label> Phone Number </label>
									<input
										className='form-input' 
										type='text'
										value={this.state.phone}
										onChange={(e) => this.handleChange('phone', e.target.value)}
									/>
								</div>
							</div>

							<div className='essos-reg-form-row'>
								<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
									<label> Password </label>
									<input
										className='form-input' 
										type='text'
										value={this.state.password}
										onChange={(e) => this.handleChange('password', e.target.value)}
									/>
								</div>
								<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
									<label> Confirm Password </label>
									<input
										className='form-input' 
										type='text'
										value={this.state.confpass}
										onChange={(e) => this.handleChange('confpass', e.target.value)}
									/>
								</div>
							</div>
							<button onClick={() => this.setState({registrationPage: 2})}> Next Page </button>
					</React.Fragment>
				)
			}
			case 2: {
				return (
					<React.Fragment>
						<div className='avatar-selection-container'>
							<div className='essos-avatar-preview-container' >
								<img src={this.state.imageSource} />
							</div>
							<h3> {`${this.state.firstName} ${this.state.lastName}`} </h3>
						</div>
						<div className='essos-reg-form-row'>
							<div className='form-label-input-container' style={{width: '70%', height: 'auto'}}>
								<label> Billing Address </label>
								<input
									className='form-input' 
									type='text'
									value={this.state.billing_address_line1}
									onChange={(e) => this.handleChange('billing_address_line1', e.target.value)}
								/>
							</div>
							<div className='form-label-input-container' style={{width: '30%', height: 'auto'}}>
								<label> Line 2 </label>
								<input
									className='form-input' 
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
									className='form-input' 
									type='text'
									value={this.state.billing_address_city}
									onChange={(e) => this.handleChange('billing_address_city', e.target.value)}
								/>
							</div>
							<div className='form-label-input-container' style={{width: '20%', height: 'auto'}}>
								<label> State </label>
								<input
									className='form-input' 
									type='text'
									value={this.state.billing_address_state}
									onChange={(e) => this.handleChange('billing_address_state', e.target.value)}
								/>
							</div>
							<div className='form-label-input-container' style={{width: '25%', height: 'auto'}}>
								<label> Zip Code </label>
								<input
									className='form-input' 
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
									className='form-input' 
									type='text'
									value={this.state.shipping_address_line1}
									onChange={(e) => this.handleChange('shipping_address_line1', e.target.value)}
								/>
							</div>
							<div className='form-label-input-container' style={{width: '30%', height: 'auto'}}>
								<label> Line 2 </label>
								<input
									className='form-input' 
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
									className='form-input' 
									type='text'
									value={this.state.shipping_address_city}
									onChange={(e) => this.handleChange('shipping_address_city', e.target.value)}
								/>
							</div>
							<div className='form-label-input-container' style={{width: '20%', height: 'auto'}}>
								<label> State </label>
								<input
									className='form-input' 
									type='text'
									value={this.state.shipping_address_state}
									onChange={(e) => this.handleChange('shipping_address_state', e.target.value)}
								/>
							</div>
							<div className='form-label-input-container' style={{width: '25%', height: 'auto'}}>
								<label> Zip Code </label>
								<input
									className='form-input' 
									type='text'
									value={this.state.shipping_address_zip}
									onChange={(e) => this.handleChange('shipping_address_zip', e.target.value)}
								/>
							</div>
						</div>
						<input className='splash-button' value={this.props.login ? 'Log In' : 'Register'} type='submit' />
					</React.Fragment>
				)
			}
		}
	}

	render() {
		const { registrationPage } = this.state
		return(
			<div className='registration-form-wrapper'>
				{ this.props.regpathEssos && 
						<form className='essos-profile-edit-form' onSubmit={(e) => this.handleSubmit(e)}>
							{ this.renderEssosStepper() }
							<button onClick={() => this.props.hideModal()}> Cancel </button>
						</form>
				}

				{( this.props.regpathOmniMaster || this.props.regpathOmniChild ) &&
					<form className='essos-profile-edit-form' onSubmit={(e) => this.handleSubmit(e)}>
						<div className='avatar-selection-container'>
							<h4> Change Avatar </h4>
						<div className='essos-avatar-preview-container' >
							<img src={this.state.imageSource} />
						</div>
							<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
								<button type='button' onClick={(e) => this.randomizeAvvy(e)}> Randomize Avatar </button>
							</div>
							<h4> OR </h4>
							<div className='form-label-input-container' style={{width: '50%', height: 'auto', alignItems:'center', justifyContent: 'center'}}>
								<label> Select a Profile Picture Instead </label>
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
									className='form-input' 
									type='text'
									value={this.state.firstName}
									onChange={(e) => this.handleChange('firstName', e.target.value)}
								/>
							</div>
							<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
								<label> Last Name </label>
								<input
									className='form-input' 
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
									className='form-input' 
									type='text'
									value={this.state.email}
									onChange={(e) => this.handleChange('email', e.target.value)}
								/>
							</div>
							<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
								<label> Phone Number </label>
								<input
									className='form-input' 
									type='text'
									value={this.state.phone}
									onChange={(e) => this.handleChange('phone', e.target.value)}
								/>
							</div>
						</div>

						<div className='essos-reg-form-row'>
							<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
								<label> Password </label>
								<input
									className='form-input' 
									type='password'
									value={this.state.password}
									onChange={(e) => this.handleChange('password', e.target.value)}
								/>
							</div>
							<div className='form-label-input-container' style={{width: '50%', height: 'auto'}}>
								<label> Confirm Password </label>
								<input
									className='form-input' 
									type='password'
									value={this.state.confpass}
									onChange={(e) => this.handleChange('confpass', e.target.value)}
								/>
							</div>
						</div>
						<input className='splash-button' value={this.props.login ? 'Log In' : 'Register'} type='submit' />
						<button onClick={() => this.props.hideModal()}> Cancel </button>
					</form>
				}
				{ this.props.login &&
					<React.Fragment>
					<div className='avatar-selection-container'>
						<h3 style={{paddingBottom: '12px'}}> Omni Commerce </h3>
						<div style={{width: 150, height: 150}}>
							<img src={'/assets/TRANSLOGOthin.svg'} />
						</div>
					</div>
					<form className='essos-profile-edit-form' onSubmit={(e) => this.handleSubmit(e)}>
						<div className='essos-reg-form-row'>
							<div className='form-label-input-container' style={{width: '100%', height: 'auto'}}>
								<label> E-Mail </label>
								<input
									className='form-input' 
									type='text'
									value={this.state.email}
									onChange={(e) => this.handleChange('email', e.target.value)}
								/>
							</div>
						</div>
						<div className='essos-reg-form-row'>
							<div className='form-label-input-container' style={{width: '100%', height: 'auto'}}>
								<label> Password </label>
								<input
									className='form-input' 
									type='password'
									value={this.state.password}
									onChange={(e) => this.handleChange('password', e.target.value)}
								/>
							</div>
						</div>
						<input className='splash-button' value={this.props.login ? 'Log In' : 'Register'} type='submit' />
						<button onClick={() => this.props.hideModal()}> Cancel </button>
					</form>
					</React.Fragment>
				}
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationForm)