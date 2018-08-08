import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../../styles/RegistrationForms.css'

import { attemptLogIn, attemptRegistration } from '../../../actions/auth'

const mapStateToProps = state => {
	const { token } = state.authReducer

	return { token }
}

const mapDispatchToProps = dispatch => ({
	attemptLogin: (credentials) => dispatch(attemptLogIn(credentials)),
	registerOmniMaster: (credentials) =>  dispatch(attemptRegistration(credentials)),
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

	}

	handleChange = (key, value) => {
		this.setState({
			[key]:value
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
		if (this.validateFormData()) {
			console.log("Truth Received")
		}
		if (this.props.loginOmni) return this.handleLogin('omni')
		if (this.props.loginEssos) return this.handleLogin('essos')
		if (this.props.regpathOmniMaster) return this.handleRegistration('omni')
		if (this.props.regpathEssos) return this.handleRegistration('essos')
		if (this.props.regpathOmniChild) return this.handleRegistration('omniChild')

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

	render() {
		return(
			<div className='registration-form-wrapper'>
				<form className='centered-box' onSubmit={event => this.handleSubmit(event)} >
					<div className='form-row'>
						<label> 
							Email
						</label> 
						<input 
							className='form-input'
							type='email'
							value={this.state.email}
							onChange={ event => this.handleChange('email', event.target.value) }
							/>
					</div>
					<div className='form-row'>
						<label> 
							Password
						</label> 
						<input 
							className='form-input'
							type='password'
							value={this.state.password}
							onChange={ event => this.handleChange('password', event.target.value) }
							/>
						</div>
					{(this.props.regpathOmniMaster || this.props.regpathEssos || this.props.regpathOmniChild) &&
						<div className='form-row'>
							<label> 
								Confirm Password
							</label> 
							<input 
								className='form-input'
								type='password'
								value={this.state.confpass}
								onChange={ event => this.handleChange('confpass', event.target.value) }
								/>
						</div>
					}
					{(this.props.regpathOmniMaster || this.props.regPathEssos || this.props.regpathOmniChild) &&
						<div className='form-row'>
							<label> 
								First Name
							</label> 
							<input 
								className='form-input'
								type='text'
								value={this.state.firstName}
								onChange={ event => this.handleChange('firstName', event.target.value) }
								/>
						</div>
					}
					{(this.props.regpathOmniMaster || this.props.regPathEssos || this.props.regpathOmniChild) &&
						<div className='form-row'>
							<label> 
								Last Name
							</label> 
							<input 
								className='form-input'
								type='text'
								value={this.state.lastName}
								onChange={ event => this.handleChange('lastName', event.target.value) }
								/>
						</div>
					}
					{(this.props.regpathOmniMaster || this.props.regPathEssos || this.props.regpathOmniChild) &&
						<div className='form-row'>
							<label> 
								Phone Number (###)-###-####
							</label> 
							<input 
								className='form-input'
								type='text'
								value={this.state.phone}
								onChange={ event => this.handleChange('phone', event.target.value) }
								/>
						</div>
					}
					{(this.props.regpathOmniChild) &&
						<div className='form-row'>
							<label> 
								Role
							</label> 
							<input 
								className='form-input'
								type='text'
								value={this.state.role}
								onChange={ event => this.handleChange('role', event.target.value) }
								/>
						</div>
					}
					<input className='splash-button' value={this.props.login ? 'Log In' : 'Register'} type='submit' />

				</form>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationForm)