import React, { Component } from 'react'
import { connect } from 'react-redux'

class OnlineMerchantRegistrationForm extends Component {
	constructor(props){
		super(props) 
		this.state = {
			firstName: 'First Name',
			lastName: 'Last Name',
			phoneNumber: 'Phone Number',
			email: 'Email',
			password: '',
			confirmPassword: '',
			address_line1: 'Address Line 1',
			address_line2: 'Address Line 2',
			address_city: 'City',
			address_zip: 'Zip Code',
			address_state: 'State (NY, CA, AR...)',
			shopName: 'Select a display name for your online store',
			userName: 'Select your display name',
			isOnlineMerchat: true,
		}
	this.handleSubmit = this.handleSubmit.bind(this)
	this.handleChange = this.handleChange.bind(this)
	
	}

	handleChange(input, value) {
		this.setState({
			[input]: value
		})
	}

	handleSubmit(event) {
		event.preventDefault()
		console.log(this.state)
	}

	render() {
		return(
		<form onSubmit={this.handleSubmit}>
			<label>
				First Name:
				<input type='text' value={this.state.firstName} onChange={e => this.handleChange('firstName', e.target.value)} />
			</label>
			<label>
				Last Name:
				<input type='text' value={this.state.lastName} onChange={e => this.handleChange('lastName', e.target.value)} />
			</label>
			<label>
				Phone Number:
				<input type='text' value={this.state.phoneNumber} onChange={e => this.handleChange('phoneNumber', e.target.value)} />
			</label>
			<label>
				Email:
				<input type='email' value={this.state.email} onChange={e => this.handleChange('email', e.target.value)} />
			</label>
			<label>
				Password:
				<input type='password' value={this.state.password} onChange={e => this.handleChange('password', e.target.value)} />
			</label>
			<label>
				Confirm Password:
				<input type='password' value={this.state.confirmPassword} onChange={e => this.handleChange('confirmPassword', e.target.value)} />
			</label>
			<label>
				Address (Line 1):
				<input type='text' value={this.state.address_line1} onChange={e => this.handleChange('address_line1', e.target.value)} />
			</label>
			<label>
				Address (Line 2):
				<input type='text' value={this.state.address_line2} onChange={e => this.handleChange('address_line2', e.target.value)} />
			</label>
			<label>
				City:
				<input type='text' value={this.state.address_city} onChange={e => this.handleChange('address_city', e.target.value)} />
			</label>
			<label>
				State:
				<input type='text' value={this.state.address_state} onChange={e => this.handleChange('address_state', e.target.value)} />
			</label>
			<label>
				ZIP Code:
				<input type='text' value={this.state.address_zip} onChange={e => this.handleChange('address_zip', e.target.value)} />
			</label>
			<label>
				Display Username:
				<input type='text' value={this.state.userName} onChange={e => this.handleChange('userName', e.target.value)} />
			</label>
			<label>
				Store Display Name:
				<input type='text' value={this.state.shopName} onChange={e => this.handleChange('shopName', e.target.value)} />
			</label>
			<input type="submit" value="submit"/>
		</form>

		)
	}
}

export default connect()(OnlineMerchantRegistrationForm)