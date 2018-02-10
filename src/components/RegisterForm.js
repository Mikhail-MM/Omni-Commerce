import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { push } from 'react-router-redux'
import LoginForm from './LoginForm'
import AutoCompleteSuggestionsBox from './AutoCompleteSuggestionsBox'
import fetch from 'cross-fetch'
import { Button, Icon, Form, Grid, Header, Image, Message, Segment, Label, Divider, Checkbox } from 'semantic-ui-react'

function mapStateToProps(state) {
	const { isAuthenticated } = state.authReducer;
	return {
		isAuthenticated,
		//userPermissions,
		//instanceType
	}
}



/*
class AutoCompleteSuggestions extends Compoenent {
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		<ul>
		// send employers found as props
		// employersArray.map(emp => <li onclick= {this.handleParentClick}> emp.orgname <li>)
		// pass clickhandle from registerform as that handler will be using registerforms props and altering registerforms state (value of find employer)
		<ul>
	}

}
*/

class RegisterForm extends Component { 

	constructor(props) {
		super(props)
		this.initialState = { 
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
			autoCompleteArray: []
		}

		this.state = this.initialState 
		
		this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
		this.handleLastNameChange = this.handleLastNameChange.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePhoneChange = this.handlePhoneChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
		this.handleBusinessOwnerRegisterCheck = this.handleBusinessOwnerRegisterCheck.bind(this);
		this.handleEmployeeRegisterCheck = this.handleEmployeeRegisterCheck.bind(this);
		this.handleEmployerLookupCheck = this.handleEmployerLookupCheck.bind(this);
		this.handleOrganizationChange = this.handleOrganizationChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.finishAutoComplete = this.finishAutoComplete.bind(this);

	}
	
	handleFirstNameChange(event) {
		this.setState(
			Object.assign({}, ...this.state, { firstName: event.target.value }))
	}
	handleLastNameChange(event) {
		this.setState(
			Object.assign({}, ...this.state, { lastName: event.target.value }))
	}
	handlePhoneChange(event) {
		this.setState(
			Object.assign({}, ...this.state, { phoneNumber: event.target.value }))
	}
	handleEmailChange(event) {
		this.setState(
			Object.assign({}, ...this.state, { email: event.target.value }))
	}
	handlePasswordChange(event) {
		this.setState(
			Object.assign({}, ...this.state, { password: event.target.value }))
	}
	handleConfirmPasswordChange(event) {
		this.setState(
			Object.assign({}, ...this.state, { confirmPassword: event.target.value }))
	}
	handleBusinessOwnerRegisterCheck(event) {
		this.setState(
			Object.assign({}, ...this.state, {isBusinessOwner: !this.state.isBusinessOwner }))
	}
	handleEmployeeRegisterCheck(event) {
		this.setState(
			Object.assign({}, ...this.state, {isEmployee: !this.state.isEmployee }))
	}
	handleEmployerLookupCheck(event) {
		this.setState(
			Object.assign({}, ...this.state, { employerLookup: event.target.value }))
				    fetch('http://localhost:3001/clients/lookup', {
		    			headers:{
		    				'Content-Type': 'application/json'
		    			},
		    				method: 'POST',
		    				mode: 'cors',
		    				body: JSON.stringify(this.state)
		    			}).then(res => {
		    				/*
		    				console.log(res)
		    				console.log(res._bodyText)
		    				const JSONresponse = res._bodyText;
		    				console.log(JSONresponse.json())
		    				console.log(typeof(JSONresponse))
		    				//const parsedArray = JSONresponse.map((r) => JSON.parse(r))
		    				*/
		    				return res.json()
		    			})
		    			.then(responseJSON => responseJSON.map((r) => r.organizationName))
		    			.then(organizations => {
		    				this.setState(
		    					Object.assign({}, ...this.state, {autoCompleteArray: organizations}))
		    			})
			
	}
	handleOrganizationChange(event) {
		this.setState(
			Object.assign({}, ...this.state, {organizationName: event.target.value}))
	}

	finishAutoComplete(arrayOfOrganizations) {
 	// Why is this DELETED and MISSING? OMG?
	}

	handleSubmit(event) {
		const { dispatch } = this.props
		event.preventDefault();
		console.log(this.state);

			if (this.state.password !== this.state.confirmPassword) {
				throw new Error("Failed Password Validation!")
			}
		
		fetch('http://localhost:3001/clients', {
		headers:{
			'Content-Type': 'application/json'
		},
		method: 'POST',
		mode: 'cors', 
		body: JSON.stringify(this.state) // beware adding other stuff to state, will have to give it to its own object
			}).then((res) => console.log(res)).then(() => this.setState(this.initialState))
		console.log(this.state)
		console.log(this.initialState)
		// The dispatch push might actually just unmount the component so calling set state on an unmounted component is basically unnecessary. 
		dispatch(push('/login'))
		// Should really be a Route - an intermediary step that tells you "Success! You've been registered! (But only if we have a successful action... so maybe putting this entire thing in a Redux action to handle the dispatching is better"
	}

	render() {
		const { isAuthenticated } = this.props;
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
		 <Grid.Column style={{ maxWidth: 800 }}>
		 <Segment basic />
		 	<Header as='h2' color='blue' textAlign='center'>
		 		<Icon name='id badge' />
		 		{' '} Register your organization to use Omni-Commerce POS
		 	</Header>
		 	<Segment raised>
		 	<Form size='large' onSubmit={this.onSubmit}>
		 		<Message>
					Help us get your online shop up and running! <br/> Your email will be used to log into your account and manage your inventory.<br/>
					Your billing and shipping information is used to deliver goods that you purchase from other users!
				</Message>
				<Form.Group>
					<Form.Input label={<Label>First Name </Label>} placeholder="First Name" width={8} value={this.state.firstName} onChange={this.handleFirstNameChange} />
					<Form.Input label={<Label>Last Name</Label>} placeholder="Last Name" width={8} type='text' value={this.state.lastName} onChange={this.handleLastNameChange} />
				</Form.Group>
				<Form.Group>
					<Form.Input label={<Label><Icon name='mail' />Email</Label>} placeholder="Email Address (Login Pass)" width={10} value={this.state.email} onChange={this.handleEmailChange} />
					<Form.Input label={<Label>Phone Number</Label>} placeholder="Phone Number" width={6} value={this.state.phoneNumber} onChange={this.handlePhoneChange} />
				</Form.Group>
				<Divider horizontal> Billing Address </Divider >
				<Form.Group>
					<Form.Input label={<Label>Password</Label>} type="password" placeholder="Password" width={8} value={this.state.password} onChange={this.handlePasswordChange} />
					<Form.Input label={<Label>Confirm Password</Label>} type="password" placeholder="Confirm Password" width={8} value={this.state.confirmPassword} onChange={this.handleConfirmPasswordChange}/>
				</Form.Group>
				<Form.Group>
					<Checkbox label="Register as business owner" checked={this.state.isBusinessOwner} onChange={this.handleBusinessOwnerRegisterCheck} />
					{ this.state.isBusinessOwner && <Form.Input label={<Label>Organization/Company Name</Label>} value={this.state.organizationName} onChange={this.handleOrganizationChange} />}
				</Form.Group>
				<Form.Group>
					<Checkbox label="Register as employee" checked={this.state.isEmployee} onChange={this.handleEmployeeRegisterCheck} />
					{ this.state.isEmployee && <Form.Input label={<Label>Find Your Employer:</Label>} checked={this.state.employerLookup} onChange={this.handleEmployerLookupCheck} /> }
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

export default withRouter(connect(mapStateToProps)(RegisterForm))