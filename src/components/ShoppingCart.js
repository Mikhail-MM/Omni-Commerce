import React, { Component } from 'react'
import { connect } from 'react-redux'

function mapStateToProps(state) {
	const { token } = state.authReducer
	return { token }
}

class ShoppingCart extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount() {
		// dispatch an action to retrieve customer's shopping cart!
	}

	generateItemsWithButtonsToRemove() {
		
	}

	render() {
		return(

		)
	}
}

export default connect(mapStateToProps)(ShoppingCart)