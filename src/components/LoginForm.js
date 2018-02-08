import React, { Component } from 'react'
import { connect } from 'react-redux'
import { attemptLogIn } from '../actions/auth-login'
import { Redirect, Link, withRouter } from 'react-router-dom'
import { Button, Icon, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

class LoginForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email: '',
			password: ''
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
	}
	
	handleUsernameChange(event) {
		this.setState({email: event.target.value})
		console.log(this.state);

	}
	handlePasswordChange(event) {
		this.setState({password: event.target.value})
	}


	handleSubmit(event) { 
		event.preventDefault();
		const { dispatch } = this.props
		const credentials = this.state
		console.log(credentials)
		dispatch(attemptLogIn(credentials)); // need to add a .then() to determine where to PUSH the browser
	}
	

	render() {

		const { isAuthenticated } = this.props; // You must pull this into the render method, or else the thing will crash saying that isAuthenticated is undefined (it is, within the render scope)
		return (
			<div className='login-form'>
				{/* ALl elements up to the grid must have a height of 100% - so the center aligned grid can be in the middle of the screen*/}
			    <style>{`
     			 	body > div,
      				body > div > div,
      				body > div > div > div.login-form {
        			height: 100%;
      				}`}
      			</style>
		{/* Best to turn this login thing into a dispatch Push action */}
			
			{ 	this.props.isAuthenticated && 
				( this.props.instanceType === "Master" || this.props.instanceType === "Employee" || this.props.instanceType === "Terminal" ) && 
				<Redirect to="/terminal" /> }
			
			{	this.props.isAuthenticated &&
				( this.props.instanceType === "OnlineMerchant" ) && 
				<Redirect to="/marketplaceDashboard" /> }
			<Grid
				textAlign='center'
				style={{ height: '100%' }}
				verticalAlign='middle'
			>
			  <Grid.Column style={{ maxWidth: 450 }}>
			    <Header as='h2' color='red' textAlign='center'>
			      <Icon name='protect' />
			      {' '}Log-in to your account
			    </Header>
			    <Form size='large' onSubmit={this.handleSubmit}>
			      <Segment stacked>
					<Form.Input
					  fluid
					  icon='user circle outline'
					  iconPosition='left'
					  placeholder='E-mail address'
					  type='email'
					  value={this.state.email} 
					  onChange={this.handleUsernameChange}
					/>
					<Form.Input
					  fluid
					  icon='lock'
					  iconPosition='left'
					  placeholder='Password'
					  type='password'
					  value={this.state.password}
					  onChange={this.handlePasswordChange}
					/>
					<Form.Button className='login-form-submit-button' fluid size='large' content='Submit'>Login</Form.Button>					  
				  </Segment>
				 </Form>
				 <Message>
						Don't have an account? Register now!<br/>
						<Link to="/login/registerPOS">  Register for a Point of Sale Terminal account</Link><br/>
						<Link to="/login/registerMerchant"> Register for an online merchant account </Link>
				</Message>
			  </Grid.Column>
			</Grid>
			</div>
		)
		

	}

}

function mapStateToProps(state) {
	const { isAuthenticated, token, instanceType } = state.authReducer
	return { isAuthenticated, token, instanceType }
}

export default withRouter(connect(mapStateToProps)(LoginForm))