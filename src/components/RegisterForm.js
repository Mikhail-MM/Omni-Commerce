import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import LoginForm from './LoginForm'
import AutoCompleteSuggestionsBox from './AutoCompleteSuggestionsBox'
import fetch from 'cross-fetch'
import { Button, Icon, Form, Grid, Header, Image, Message, Segment, Label, Divider, Checkbox } from 'semantic-ui-react'

import ModalRoot from './ModalRoot'

import { showModal } from '../actions/modals'
import { throwError } from '../actions/errors'

function mapStateToProps(state) {
	const { isAuthenticated } = state.authReducer;
	return {
		isAuthenticated,
	}
}

class RegisterForm extends Component { 

	constructor(props) {
		super(props)
		this.initialFormState = { 
			firstName: 'First Name',
			lastName: 'Last Name',
			phoneNumber: 'Phone Number',
			email: 'Email',
			password: '',
			confirmPassword: '',
			isBusinessOwner: false,
			isEmployee: false,
			employerLookup: '',
			organizationName:'',
		}

		this.state = Object.assign({}, this.initialState, {hasError: false, validationErrors: []})

		this.handleBusinessOwnerRegisterCheck = this.handleBusinessOwnerRegisterCheck.bind(this);
		this.handleEmployeeRegisterCheck = this.handleEmployeeRegisterCheck.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleBusinessOwnerRegisterCheck(event) {
		this.setState(
			Object.assign({}, ...this.state, {isBusinessOwner: !this.state.isBusinessOwner, employerLookup: '' }))
	}
	handleEmployeeRegisterCheck(event) {
		this.setState(
			Object.assign({}, ...this.state, {isEmployee: !this.state.isEmployee, organizationName: '' }))
	}
	handleOrganizationChange(event) {
		this.setState(
			Object.assign({}, ...this.state, {organizationName: event.target.value}))
	}
	
	throwError(errorMessage) { 
		console.log("Throwing an Error!")
		throw Error(errorMessage) 
	}
	async handleSubmit(event) {
		// Clear any previous errors
		console.log(this.state)
		const { dispatch } = this.props
		this.setState({ hasError: false, validationErrors: [] }) 
		event.preventDefault();

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
				confirmPassword: this.state.confirmPassword,
				isBusinessOwner: this.state.isBusinessOwner,
				isEmployee: this.state.isEmployee,
				employerLookup: this.state.employerLookup,
				organizationName: this.state.organizationName,
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
						console.log(json) // Development Check
						dispatch(showModal('REGISTRATION_CONFIRMATION_MODAL', {json}))
					})
					.catch(err => {
						localValidationErrors.push(err.message);
					})
			}

			console.log(localValidationErrors)
			if (localValidationErrors.length > 0) { this.setState({hasError: true, validationErrors: localValidationErrors}) }

		} 
	
	handleChange(input, value) {
		this.setState({
			[input]: value
		})
	}

	generateValidationErrorsInDOM() {
		console.log(this.state)
		console.log(this.state.validationErrors[0])
		console.log(typeof(this.state.validationErrors[0]))
		return this.state.validationErrors.map(errorText => <p>{errorText}</p>)
	}

	render() {
		const { isAuthenticated } = this.props;
		return(

		<div className="merchant-registration-form">
		<ModalRoot />
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
		 <Grid.Column style={{ maxWidth: 800 }}>
		 <Segment basic />
		 	<Header as='h2' color='blue' textAlign='center'>
		 		<Icon name='id badge' />
		 		{' '} Register your organization to use Omni-Commerce POS
		 	</Header>
		 	<Segment raised>
		 	<Form size='large' onSubmit={this.handleSubmit}>
		 		<Message>
					Help us get your online shop up and running! <br/> Your email will be used to log into your account and manage your inventory.<br/>
					Your billing and shipping information is used to deliver goods that you purchase from other users!
				</Message>
				<Form.Group>
					<Form.Input label={<Label>First Name </Label>} placeholder="First Name" width={8} value={this.state.firstName} onChange={e => this.handleChange('firstName', e.target.value)} />
					<Form.Input label={<Label>Last Name</Label>} placeholder="Last Name" width={8} type='text' value={this.state.lastName} onChange={e => this.handleChange('lastName', e.target.value)} />
				</Form.Group>
				<Form.Group>
					<Form.Input label={<Label><Icon name='mail' />Email</Label>} placeholder="Email Address (Login Pass)" width={10} value={this.state.email} onChange={e => this.handleChange('email', e.target.value)} />
					<Form.Input label={<Label>Phone Number</Label>} placeholder="Phone Number" width={6} value={this.state.phoneNumber} onChange={e => this.handleChange('phoneNumber', e.target.value)} />
				</Form.Group>
				<Divider horizontal> Billing Address </Divider >
				<Form.Group>
					<Form.Input label={<Label>Password</Label>} type="password" placeholder="Password" width={8} value={this.state.password} onChange={e => this.handleChange('password', e.target.value)} />
					<Form.Input label={<Label>Confirm Password</Label>} type="password" placeholder="Confirm Password" width={8} value={this.state.confirmPassword} onChange={e => this.handleChange('confirmPassword', e.target.value)}/>
				</Form.Group>
				<Form.Group>
					<Checkbox disabled={this.state.isEmployee} label="Register as business owner" checked={this.state.isBusinessOwner} onChange={this.handleBusinessOwnerRegisterCheck} />
					{ this.state.isBusinessOwner && <Form.Input label={<Label>Organization/Company Name</Label>} value={this.state.organizationName} onChange={e => this.handleChange('organizationName', e.target.value)} />}
				</Form.Group>
				<Form.Group>
					<Checkbox disabled={this.state.isBusinessOwner} label="Register as employee" checked={this.state.isEmployee} onChange={this.handleEmployeeRegisterCheck} />
					{ this.state.isEmployee && <Form.Input label={<Label>Find Your Employer:</Label>} checked={this.state.employerLookup} onChange={e => this.handleChange('employerLookup', e.target.value)} /> }
				</Form.Group>

				{this.state.hasError && 
					<Message negative>
						<h5> Error - Something went wrong during Registration - Please try again! </h5>
						{this.generateValidationErrorsInDOM()}
					</Message>
				}
				
				<Form.Button className='merchant-registration-submit-button' size='large' content='Submit'>Register</Form.Button>
		 	</Form>

		 	</Segment>
		</Grid.Column>
		</Grid>
		</div>
	
		)
	}
}

export default withRouter(connect(mapStateToProps)(RegisterForm))