import React, { Component } from 'react'
import { connect } from 'react-redux'

function mapStateToProps(state) {
	const { token } = state.authReducer
	return { token }
}

class OnlineStorefrontBrowser extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount() {
		// dispatch an action to retrieve all stores!
	}
	generateStorePortals() {
		// dispatch an action to route to OnlineStoreItemBrowser
	}

	render() {
		return(

		)
	}
}

export default connect(mapStateToProps)(OnlineStorefrontBrowser)