import React, { Component } from 'react'
import { connect } from 'react-redux'
import { attemptLogIn } from '../actions/auth-login'
import { Redirect, Link, withRouter } from 'react-router-dom'
import { Button, Icon, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

function mapStateToProps(state) {
	const { isAuthenticated, token, instanceType, hasError, errorText  } = state.authReducer
	return { isAuthenticated, token, instanceType, hasError, errorText  }
}

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
		dispatch(attemptLogIn(credentials));
	}
	

	render() {

		const { isAuthenticated, errorText } = this.props; 
		
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
			      	
			      	{ this.props.hasError && 
			      		<Message negative>
			      			<Message.Header>Log-in failed! Please try again</Message.Header>
			      			<p>Please ensure that you have the correct login credentials</p>
			      			<p>Development Error: </p>
			      			<p>{errorText} </p>
			      		</Message> }

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
						<Link to="/register_business_organization">  Register for a Point of Sale Terminal account</Link><br/>
						<Link to="/login/register_merchant"> Register for an Online Merchant account to buy and sell goods! </Link>
				</Message>
			  </Grid.Column>
			</Grid>
			</div>
		)
		

	}

}


export default withRouter(connect(mapStateToProps)(LoginForm))