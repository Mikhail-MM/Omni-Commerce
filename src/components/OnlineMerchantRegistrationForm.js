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
			billing_address_line1: '',
			billing_address_line2: '',
			billing_address_city: '',
			billing_address_zip: '',
			billing_address_state: '',
			sameAddress: false,
			shipping_address_line1: '',
			shipping_address_line2: '',
			shipping__address_city: '',
			shipping_address_zip: '',
			shipping_address_state: '',
			shopName: 'Store Name',
			userName: 'Display Name',
		}
	this.handleSubmit = this.handleSubmit.bind(this)
	this.handleChange = this.handleChange.bind(this)
	this.handleAutofill = this.handleAutofill.bind(this)
	}

	handleChange(input, value) {
		this.setState({
			[input]: value
		})
	}
	handleAutofill(){
		this.setState({sameAddress: !this.state.sameAddress}, () => {
			if (this.state.sameAddress) {
				// This may be async
				this.setState({
					shipping_address_line1: this.state.billing_address_line1,
					shipping_address_line2: this.state.billing_address_line2,
					shipping_address_city: this.state.billing_address_city,
					shipping_address_zip: this.state.billing_address_zip,
					shipping_address_state: this.state.billing_address_state,
				});
			}
			if (!this.state.sameAddress) {
				this.setState({
					shipping_address_line1: '',
					shipping_address_line2: '',
					shipping_address_city: '',
					shipping_address_zip: '',
					shipping_address_state: '',
				});
			}
		});	
	}
	handleSubmit(event) {
		event.preventDefault()
		console.log(this.state)
	}

	render() {
		return(
		<form onSubmit={this.handleSubmit}>
			<label>
				Display Username:
				<input type='text' value={this.state.userName} onChange={e => this.handleChange('userName', e.target.value)} />
			</label>
			<label>
				Store Display Name:
				<input type='text' value={this.state.shopName} onChange={e => this.handleChange('shopName', e.target.value)} />
			</label>
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
			<div className="BillingAddressInputs">
			<label>
				Billing Address (Line 1):
				<input type='text' value={this.state.address_line1} onChange={e => this.handleChange('billing_address_line1', e.target.value)} />
			</label>
			<label>
				Billing Address (Line 2):
				<input type='text' value={this.state.address_line2} onChange={e => this.handleChange('billing_address_line2', e.target.value)} />
			</label>
			<label>
				City:
				<input type='text' value={this.state.address_city} onChange={e => this.handleChange('billing_address_city', e.target.value)} />
			</label>
			<label>
				State:
				<input type='text' value={this.state.address_state} onChange={e => this.handleChange('billing_address_state', e.target.value)} />
			</label>
			<label>
				ZIP Code:
				<input type='text' value={this.state.address_zip} onChange={e => this.handleChange('billing_address_zip', e.target.value)} />
			</label>
			</div>
			<label>
				Use billing address as shipping address 
				<input type='checkbox' checked={this.state.sameAddress} onChange={this.handleAutofill}/>
			</label>
			<div className="ShippingAddressInputs">
			<label>
				Shipping Address (Line 1):
				<input type='text' value={this.state.address_line1} onChange={e => this.handleChange('shipping_address_line1', e.target.value)} />
			</label>
			<label>
				Shipping Address (Line 2):
				<input type='text' value={this.state.address_line2} onChange={e => this.handleChange('shipping_address_line2', e.target.value)} />
			</label>
			<label>
				City:
				<input type='text' value={this.state.address_city} onChange={e => this.handleChange('shipping_address_city', e.target.value)} />
			</label>
			<label>
				State:
				<input type='text' value={this.state.address_state} onChange={e => this.handleChange('shipping_address_state', e.target.value)} />
			</label>
			<label>
				ZIP Code:
				<input type='text' value={this.state.address_zip} onChange={e => this.handleChange('shipping_address_zip', e.target.value)} />
			</label>
			</div>
			<input type="submit" value="submit"/>
		</form>

		)
	}
}

export default connect()(OnlineMerchantRegistrationForm)