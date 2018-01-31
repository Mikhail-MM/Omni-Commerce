import React, { Component } from 'react'
import { connect } from 'react-redux'

// Should be a form that uses the authroken to route to Client's Marketplace - upload a new item via a POST request

function mapStateToProps(state) {
	const { token } = state.authReducer;
	return { token }
}

class AddMarketplaceItemForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			itemName: ''
			itemPrice: ''
			tags: []
			
		}
	}
}

export default connect(mapStateToProps)(AddMarketplaceItemForm)