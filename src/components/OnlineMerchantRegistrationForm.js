import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetch from 'cross-fetch'
import { Button, Icon, Form, Grid, Header, Image, Message, Segment, Label, Divider, Checkbox } from 'semantic-ui-react'

import ModalRoot from './ModalRoot'

import { showModal } from '../actions/modals'
import { throwError } from '../actions/errors'


class OnlineMerchantRegistrationForm extends Component {
	constructor(props){
	super(props) 
		this.initialState = {
			firstName: '',
			lastName: '',
			phoneNumber: '',
			email: '',
			password: '',
			confirmPassword: '',
			billing_address_line1: '',
			billing_address_line2: '',
			billing_address_city: '',
			billing_address_zip: '',
			billing_address_state: '',
			sameAddress: false, // should change this from a button since state does not continuously change when it is entered
			shipping_address_line1: '',
			shipping_address_line2: '',
			shipping__address_city: '',
			shipping_address_zip: '',
			shipping_address_state: '',
			shopName: '',
			userName: '',
			isOnlineMerchant: true, // Decide whether it is necessary to differentiate between buyers and sellers or simply give all new clients an empty store
		}
		this.state = Object.assign({}, this.initialState, {hasError: false, validationErrors: []})
	
	this.handleSubmit = this.handleSubmit.bind(this)
	this.handleChange = this.handleChange.bind(this)
	this.handleAutofill = this.handleAutofill.bind(this)
	
	}

	componentDidMount() {
		console.log(this.state)
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
	async handleSubmit(event) {
		
		event.preventDefault()
	
		const { dispatch } = this.props

		// Clear Errors in State
		this.setState({ hasError: false, validationErrors: [] }) 


			const localValidationErrors = []
				
				if (this.state.password !== this.state.confirmPassword) {
					localValidationErrors.push("Passwords do not match! Please try again!")
				}

			const data = {
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				phoneNumber: this.state.phoneNumber,
				email: this.state.email,
				password: this.state.password,
				billing_address_line1: this.state.billing_address_line1,
				billing_address_line2: this.state.billing_address_line2,
				billing_address_city: this.state.billing_address_city,
				billing_address_zip: this.state.billing_address_zip,
				billing_address_state: this.state.billing_address_state,
				shipping_address_line1: this.state.shipping_address_line1,
				shipping_address_line2: this.state.shipping_address_line2,
				shipping__address_city: this.state.shipping__address_city,
				shipping_address_zip: this.state.shipping_address_zip,
				shipping_address_state: this.state.shipping_address_state,
				shopName: this.state.shopName,
				userName: this.state.userName,
				isOnlineMerchant: this.state.isOnlineMerchant,
			}

		if(localValidationErrors.length === 0) {

				await fetch('http://localhost:3001/clients', {
					headers:{
						'Content-Type': 'application/json'
					},
					method: 'POST',
					mode: 'cors', 
					body: JSON.stringify(data)
					})
					.then(response => response.ok ? response.json() : throwError(response.statusText.concat(' - ').concat(response._bodyText)))
					.then(json => {
						const modalProps = Object.assign({}, {registrationReturn: json}, {registrationModalMode: 'Marketplace'}) 
						dispatch(showModal('REGISTRATION_CONFIRMATION_MODAL', {...modalProps}))
					})
					.catch(err => {
						localValidationErrors.push(err.message);
					})
			}

		if (localValidationErrors.length > 0) { this.setState({hasError: true, validationErrors: localValidationErrors}) }
	}

	render() {
		return(
		<div className="merchant-registration-form">
				<style>{`
     			 	body > div,
      				body > div > div,
      				body > div > div > div.login-form {
        			height: 100%;
      				}`}
      			</style>
		<Grid
		textAlign='center'
		style={{ height: '100%' }}
		verticalAlign='middle'
		>
		<ModalRoot />
		 <Grid.Column style={{ maxWidth: 800 }}>
		 	<Segment basic />
		 	<Header as='h2' color='blue' textAlign='center'>
		 		<Icon name='shopping basket' />
		 		{' '} Register for a Merchant Account!
		 	</Header>
		 	<Segment raised>
			<Form size="large" onSubmit={this.handleSubmit}>
				<Message>
					Help us get your online shop up and running! <br/> Your email will be used to log into your account and manage your inventory.<br/>
					Your billing and shipping information is used to pay for and recieve delivered goods that you purchase from other users!
				</Message>
				<Form.Group>
					<Form.Input  label={<Label>First Name </Label>} placeholder="First Name" width={8} value={this.state.firstName} onChange={e => this.handleChange('firstName', e.target.value)}/>
					<Form.Input  label={<Label>Last Name</Label>} placeholder="Last Name" width={8} value={this.state.lastName} onChange={e => this.handleChange('lastName', e.target.value)} />
				</Form.Group>
				<Form.Group>
					<Form.Input label={<Label><Icon name='mail' />Email</Label>} placeholder="Email Address (Login Pass)" width={10} value={this.state.email} onChange={e => this.handleChange('email', e.target.value)}/>
					<Form.Input label={<Label>Phone Number</Label>} placeholder="Phone Number" width={6} value={this.state.phoneNumber} onChange={e => this.handleChange('phoneNumber', e.target.value)}/>
				</Form.Group>
				<Form.Group>
					<Form.Input  label={<Label>Password</Label>} placeholder="Password" value={this.state.password} onChange={e => this.handleChange('password', e.target.value)} />
					<Form.Input  label={<Label>Confirm Password</Label>} placeholder="Confirm Password" value={this.state.confirmPassword} onChange={e => this.handleChange('confirmPassword', e.target.value)} />
				</Form.Group>
				<Divider horizontal> Billing Address </Divider >
				<Form.Group>
					<Form.Input  className='leftLabel' label={<Label><Icon name='payment' />Billing Address</Label>} placeholder="Billing Address (Line 1)" width={12} value={this.state.billing_address_line1} onChange={e => this.handleChange('billing_address_line1', e.target.value)} />
					<Form.Input  label={<Label><Icon name='payment' />Line 2</Label>} placeholder="Billing Address (Line 2)" width={4} value={this.state.billing_address_line2} onChange={e => this.handleChange('billing_address_line2', e.target.value)} />
				</Form.Group>
				<Form.Group>
					<Form.Input  label={<Label><Icon name='payment' />City</Label>} placeholder="New York" width={8} value={this.state.billing_address_city} onChange={e => this.handleChange('billing_address_city', e.target.value)} />
					<Form.Input  label={<Label><Icon name='payment' />State</Label>} placeholder="NY" width={2} value={this.state.billing_address_state} onChange={e => this.handleChange('billing_address_state', e.target.value)} />
					<Form.Input  label={<Label><Icon name='payment' />Zip Code</Label>} placeholder="04151" width={6}  value={this.state.billing_address_zip} onChange={e => this.handleChange('billing_address_zip', e.target.value)}/>
				</Form.Group>
				<Divider horizontal> Shipping Address </Divider >
				<Checkbox label="Use billing address information as shipping address" checked={this.state.sameAddress} onChange={this.handleAutofill}/>
				<Form.Group>
					<Form.Input  className='leftLabel' label={<Label><Icon name='truck' />Shipping Address</Label>} placeholder="Shipping Address (Line 1)" width={12} value={this.state.shipping_address_line1} onChange={e => this.handleChange('shipping_address_line1', e.target.value)} />
					<Form.Input  label={<Label><Icon name='truck' />Line 2</Label>} placeholder="Shipping Address (Line 2)" width={4} value={this.state.shipping_address_line2} onChange={e => this.handleChange('shipping_address_line2', e.target.value)} />
				</Form.Group>
				<Form.Group>
					<Form.Input  label={<Label><Icon name='truck' />City</Label>} placeholder="New York" width={8} value={this.state.shipping_address_city} onChange={e => this.handleChange('shipping_address_city', e.target.value)} />
					<Form.Input  label={<Label><Icon name='truck' />State</Label>} placeholder="NY" width={2} value={this.state.shipping_address_state} onChange={e => this.handleChange('shipping_address_state', e.target.value)} />
					<Form.Input  label={<Label><Icon name='truck' />Zip Code</Label>} placeholder="04151" width={6}  value={this.state.shipping_address_zip} onChange={e => this.handleChange('shipping_address_zip', e.target.value)} />
				</Form.Group>
				<Divider horizontal> Display Info </Divider>
				<Form.Group>
				<Form.Input  label={<Label>UserName</Label>} placeholder="Display Name" width={8} value={this.state.userName} onChange={e => this.handleChange('userName', e.target.value)} />
				<Form.Input  label={<Label>Marketplace Display Name</Label>} placeholder="My Marketplace" width={8} value={this.state.shopName} onChange={e => this.handleChange('shopName', e.target.value)} />
				</Form.Group>
				<Form.Button className='merchant-registration-submit-button' size='large' content='Submit'>Register</Form.Button>
			</Form>
			</Segment>
		</Grid.Column>
		</Grid>
		</div>
		)
	}
}

export default connect()(OnlineMerchantRegistrationForm)