import React, { Component } from 'react'
import { connect } from 'react-redux'

function mapStateToProps(state) {
	const { token } = state.authReducer
	return { token }
}

class OnlineMerchantDashboard extends Component {
	constructor(props){
		super(props)
		this.state = {}
	}

	render() {
		return(
			<div>This is the merchant dashboard which allows users to gain access to all their marketplace info and links to browse the inventory of other stores </div>
		)
	}
}

export default connect(mapStateToProps)(OnlineMerchantDashboard)