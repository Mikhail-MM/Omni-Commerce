import React, { Component } from 'react'
import { connect } from 'react-redux'

import { postItemToMarketplace } from '../actions/marketplaces'

// Should be a form that uses the authroken to route to Client's Marketplace - upload a new item via a POST request

function mapStateToProps(state) {
	const { token } = state.authReducer;
	return { token }
}

class AddMarketplaceItemForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			itemName: '',
			itemPrice: '',
			imageURL: '',
			numberInStock: '',
			
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(input, value) {
		this.setState({
			[input]: value
		})
	}

	handleSubmit(event) {
		event.preventDefault()
		const { dispatch, token } = this.props

		dispatch(postItemToMarketplace(token, this.state))

	}

	render() {
		return(
		<form onSubmit={this.handleSubmit}>
			<label>
				Item Listing Name:
				<input type='text' value={this.state.itemName} onChange={e => this.handleChange('itemName', e.target.value)} />
			</label>
			<label>
				Item Listing Price:
				<input type='text' value={this.state.itemPrice} onChange={e => this.handleChange('itemPrice', e.target.value)} />
			</label>
			<label>
				Image URL (Implement as File Upload Later):
				<input type='text' value={this.state.imageURL} onChange={e => this.handleChange('imageURL', e.target.value)} />
			</label>
			<label>
				Number in Stock
				<input type='number' value={this.state.numberInStock} onChange={e => this.handleChange('numberInStock', e.target.value)} />
			</label>
			<input type='submit' />
		</form>
		)

	}
}

export default connect(mapStateToProps)(AddMarketplaceItemForm)

/*

	itemName: String,
	itemPrice: Number,
	mongoCollectionKey: String,
	imageURL: String, 
	category: String, // Consider consolidating with tags
	options: [String],
	tags: [String],
	numberInStock: Number,
	status: String, // inStock/ outOfStock
	sellerRef_Id: {type: Schema.Types.ObjectId, ref: 'Client'}
	marketplaceRef_Id: {type: Schema.Types.ObjectId, ref: 'Marketplace'}

	*/