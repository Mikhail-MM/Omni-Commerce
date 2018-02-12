import React, { Component } from 'react'
import { connect } from 'react-redux'

import { createNewTicket } from '../actions/tickets-transactions'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { loggedInUsers } = state.activeEmployeesReducer
	return { token, loggedInUsers }
}

class WaiterCallScreenMenu extends Component {
	constructor(props) {
		super(props)

		this.generateWaiterCallScreen = this.generateWaiterCallScreen.bind(this)
		this.postNewTicketByServerName = this.postNewTicketByServerName.bind(this)
	}

	generateWaiterCallScreen() {

		const { dispatch } = this.props
		const { token, loggedInUsers } = this.props
		console.log(loggedInUsers)
		
		if (loggedInUsers) return loggedInUsers.map(server => <button key={server} onClick={this.postNewTicketByServerName.bind(this, token, server, dispatch)}>{server}</button>)	

	}

	postNewTicketByServerName(token, name, dispatch){
		dispatch(createNewTicket(token, name))	
	}

	render() {
		const { loggedInUsers } = this.props
		console.log(loggedInUsers)
		return(
			<div>
			HELLO!? IS ANYONE THERE!??!?!
			{ loggedInUsers && this.generateWaiterCallScreen() }
			</div>
		)
	}
}

export default connect(mapStateToProps)(WaiterCallScreenMenu)