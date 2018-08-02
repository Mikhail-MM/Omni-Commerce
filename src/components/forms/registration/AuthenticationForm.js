import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../../styles/RegistrationForms.css'

import { attemptLogIn, attemptRegistration } from '../../../actions/auth'

const mapDispatchToProps = dispatch => ({
	attemptLogin: (credentials) => dispatch(attemptLogIn(credentials)),
	registerOmniMaster: (credentials) =>  dispatch(attemptRegistration(credentials)),
})
class AuthenticationForm extends Component {
	state = {
		email: '',
		password: '',
		confpass: '',
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

	}

	handleLogin = (pathway) => {
		const credentials = {
			
			email: this.state.email,
			password: this.state.password,
			loginPath: pathway,

		}

		return this.props.attemptLogin(credentials)

	}

	handleRegistration = (pathway) => {
		const credentials = {

			...this.state,
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
					{(this.props.regpathOmniMaster || this.props.regpathEssos) &&
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
					<input className='splash-button' value={this.props.login ? 'Log In' : 'Register'} type='submit' />

				</form>
			</div>
		)
	}
}

export default connect(null, mapDispatchToProps)(AuthenticationForm)