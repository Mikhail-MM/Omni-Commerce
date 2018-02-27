import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Form, Button, Segment, Message, Label } from 'semantic-ui-react'

import { postItemToMarketplace } from '../actions/marketplaces'

// Should be a form that uses the authroken to route to Client's Marketplace - upload a new item via a POST request
function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg)$/));

console.log(images)
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
			numberInStock: 1,
			tags: [],
			selectedFile: null,
			
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.renderTagSelectionsToDOM = this.renderTagSelectionsToDOM.bind(this)
		this.handleTagChange = this.handleTagChange.bind(this)
		this.imageSelectedHandler = this.imageSelectedHandler.bind(this)
		this.fileUploadHandler = this.fileUploadHandler.bind(this)
	}

	handleChange(input, value) {
		this.setState({
			[input]: value
		})
	}

	imageSelectedHandler(event) {
		console.log(event.target.files[0])
		this.setState({selectedFile: event.target.files[0]}, console.log(this.state.selectedFile))
	}

	fileUploadHandler(event) {
		event.preventDefault()
		const { dispatch, token } = this.props

		const formData = new FormData()
		
		formData.append('itemName', this.state.itemName)
		formData.append('itemPrice', this.state.itemPrice)
		formData.append('marketplaceItems', this.state.selectedFile)
		formData.append('numberInStock', this.state.numberInStock)
		formData.append('tags', this.state.tags)
		
		dispatch(postItemToMarketplace(token, formData))
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

	render() {
		return(
			<Form onSubmit={this.fileUploadHandler} >
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
						<Form.Input
							type='file'
							name='marketplaceItems'
							onChange={this.imageSelectedHandler}
						/>
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