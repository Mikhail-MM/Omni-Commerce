// Unused - see if we need to connect this to use dispatch.push

import React, { Component } from 'react'
import { connect } from 'react-redux'

class InitialRoutingSwitchboard extends Component {

	render() {
		return(
			<Switch>
					<Redirect exact="true" from="/" to="/login"/>
					<Route path="/splash" render={() => <div> Marketing Splash </div> } />
					<Route exact path="/login" component={LoginForm} />
					<Route path="/MobilePointOfSale" render={() => <div> Mobile POS WebApp </div> } />
					<Route path="/TerminalPointOfSale" render={() => <div> Static POS Terminal / IPAD </div> } />
					<Route path="/AdminDashboard" render={() => <div> Admin Dashboard </div> } />
					<Route path="/login/register" component={RegisterForm}/>
			</Switch>
		)
	}
}


export default connect(mapStateToProps)(InitialRoutingSwitchboard)