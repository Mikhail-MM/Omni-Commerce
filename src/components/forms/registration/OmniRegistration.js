import React, { Component } from 'react'
import '../../styles/RegistrationForms.css'

class OmniRegistration extends Component {
	state = {
		email: '',
		pass: '',
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
		
		if (!this.state.email || !this.state.pass || !this.state.confpass) return console.log("Please fill out missing fields")
		
		if (!emailRegex.test(this.state.email)) return console.log("Error, Enter a valid e-mail.")
		
		
		if (this.state.pass !== this.state.confpass) return console.log("Passwords do not match")
		
		console.log(emailRegex.test('doodoo'))
		console.log(emailRegex.test('aa@asd.asdasdasfsaf'))
		return true
	}


	handleSubmit = (event) => {
		event.preventDefault()
		if (this.validateFormData()) {
			console.log("Truth Received")
		}
		console.log('Received Form State')
		console.log(this.state)

		
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
							value={this.state.pass}
							onChange={ event => this.handleChange('pass', event.target.value) }
							/>
						</div>
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
					<input className='splash-button' value='Register' type='submit' />

				</form>
			</div>
		)
	}
}

export default OmniRegistration