import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Form, Button, Segment, Message, Label } from 'semantic-ui-react'

import { updateMarketplaceItem } from '../actions/marketplaces'

// Should be a form that uses the authroken to route to Client's Marketplace - upload a new item via a POST request

function mapStateToProps(state) {
	const { token } = state.authReducer;
	const { currentMarketplaceItem } = state.marketplaceItemsReducer;
	return { token, currentMarketplaceItem }
}

class ModifyMyStoreItemForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			itemName: '',
			itemPrice: '',
			imageURL: '',
			numberInStock: 1,
			tags: [],
			
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.renderTagSelectionsToDOM = this.renderTagSelectionsToDOM.bind(this)
		this.handleTagChange = this.handleTagChange.bind(this)
	}

	componentDidMount() {
		const { currentMarketplaceItem } = this.props
		this.setState({
			itemName: currentMarketplaceItem.itemName,
			itemPrice: currentMarketplaceItem.itemPrice,
			imageURL: currentMarketplaceItem.imageURL
			numberInStock: currentMarketplaceItem.numberInStock,
			tags: currentMarketplaceItem.tags,
		})
	}

	handleChange(input, value) {
		this.setState({
			[input]: value
		})
	}

	renderTagSelectionsToDOM() {
		const allTags = ["Clothes", "Men's", "Women's", "Tops", "Bottoms", "Accessories", "Shoes", "Art", "Computers", "Electronics", "Appliances", "Cars", "Motorcycles", "Furniture" ]

		return allTags.map(tag => {
			if (!this.state.tags.includes(tag))return <Label onClick={ () => this.handleTagChange(tag) }>{tag}</Label>
			else if (this.state.tags.includes(tag)) return <Label color='red' onClick={ () => this.handleTagChange(tag) }> {tag} </Label>
		})

	}
	handleTagChange(tagName){
		if (!this.state.tags.includes(tagName)) {
			this.setState({
				tags: this.state.tags.concat([tagName])	
			})
		}
		if (this.state.tags.includes(tagName)) {
			this.setState({
				tags: this.state.tags.filter(item => item !== tagName)
			})
		}
		
	}

	handleSubmit(event) {
		event.preventDefault()
		const { dispatch, currentMarketplaceItem, token } = this.props
		dispatch(updateMarketplaceItem(token, currentMarketplaceItem._id, this.state))

	}

	render() {
		return(
			<Form onSubmit={this.handleSubmit} >
				<Segment raised>
					<Message> 
						Create a descriptive name for your item listing
							<Form.Input
								fluid
								placeholder="Item Name"
								type='text'
								value={this.state.itemName}
								onChange={(e) => this.handleChange('itemName', e.target.value)} 
							/>
					</Message>
					<Message>
						Price your item
						<Form.Input
							fluid
							placeholder="Item Price"
							type='text'
							value={this.state.itemPrice}
							onChange={e => this.handleChange('itemPrice', e.target.value)}
						/>
					</Message>
					<Message>
						Please upload an image to be shown when users look at your listing
						<Form.Input
							fluid
							placeholder="URL"
							type='text'
							value={this.state.imageURL} 
							onChange={e => this.handleChange('imageURL', e.target.value)} 
						/>
					</Message>
					<Message>
						What kind of item are you selling?
						<div className="tagSelectionContainer">
						{ this.renderTagSelectionsToDOM() } 
						</div>
					</Message>
					<Message>
						Quantity to stock (Default is one item)
						<Form.Input
							fluid
							placeholder="# In Stock"
							type='number'
							value={this.state.numberInStock} 
							onChange={e => this.handleChange('numberInStock', e.target.value)}
						/>
					</Message>
					<Form.Button fluid size='large' content='Submit'>Add Item To My Marketplace</Form.Button>
				</Segment>
			</Form>
		)

	}
}

export default connect(mapStateToProps)(ModifyMyStoreItemForm)
