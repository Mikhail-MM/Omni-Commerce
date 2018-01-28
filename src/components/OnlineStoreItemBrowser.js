import React, { Component } from 'react'
import { connect } from 'react-redux'

function mapStateToProps(state) {
	const { token } = state.authReducer
	return { token }
}

class OnlineStoreItemBrowser extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount() {
		// dispatch an action to retrieve all items within the store!
		// dispatch to current store
	}
	generateItemBuyScreen() {
		// dispatch 
	}

	render() {
		return(

		)
	}
}

export default connect(mapStateToProps)(OnlineStoreItemBrowser)