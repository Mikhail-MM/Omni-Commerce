import React, { Component } from 'react'
import { connect } from 'react-redux'
import { attemptLogIn } from '../actions/auth-login'
import { Redirect, Link, withRouter } from 'react-router-dom'


class LoginForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email: 'Email',
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
			<div>
		{/* Best to turn this login thing into a dispatch Push action */}
			
			{ 	this.props.isAuthenticated && 
				( this.props.instanceType === "Master" || this.props.instanceType === "Employee" || this.props.instanceType === "Terminal" ) && 
				<Redirect to="/terminal" /> }
			
			{	this.props.isAuthenticated &&
				( this.props.instanceType === "OnlineMerchant" ) && 
				<Redirect to="/marketplaceDashboard" /> }
			
			<form onSubmit={this.handleSubmit}>
				<label>
				Username:
				<input type="text" value={this.state.email} onChange={this.handleUsernameChange} />
				</label>
				<label>
				Password:
				<input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
				</label>
				<input type="submit" value="Log In"/>
				<div>
				Don't have an account? Register now!
				<Link to="/login/registerPOS">  Register for a Point of Sale Terminal account</Link>
				<Link to="/login/registerMerchant"> Register for an online merchant account </Link>
				</div> 
			</form>
			</div>
		)
		

	}

}

function mapStateToProps(state) {
	const { isAuthenticated, token, instanceType } = state.authReducer
	return { isAuthenticated, token, instanceType }
}

export default withRouter(connect(mapStateToProps)(LoginForm))