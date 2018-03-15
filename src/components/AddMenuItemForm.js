import React, { Component } from 'react'
import { createNewMenuItem } from '../actions/menu-items'
import { connect } from 'react-redux'
import { Form, Input, Segment } from 'semantic-ui-react'

function mapStateToProps(state) {
	const { token } = state.authReducer
	return { token }

}

class AddMenuItemForm extends Component {
	constructor(props){
		super(props)
		this.initialState = {
			itemName: '',
			itemPrice: '',
			category: '',
			selectedFile: null
		}

		this.state = this.initialState

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this);
		this.imageSelectedHandler = this.imageSelectedHandler.bind(this)
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

	handleSubmit(event) {
		const { token, dispatch } = this.props
		const { itemName, itemPrice, category } = this.state
		event.preventDefault()
		const jsonData = { 
			itemName,
			itemPrice,
			category
		}
		dispatch(createNewMenuItem(token, jsonData))
		this.setState(this.initialState)

	}

	render() {
		return(
		<Form onSubmit={this.handleSubmit}>
			<Segment className="addItemModalForm" raised>
			<Form.Input
				fluid
				placeholder='Item Name'
				type='text'
				value={this.state.itemName} 
				onChange={(e) => this.handleChange('itemName', e.target.value)}
			/>
			<Form.Input
				fluid
				placeholder='Item Price'
				type='text'
				value={this.state.itemPrice} 
				onChange={(e) => this.handleChange('itemPrice', e.target.value)}
			/>
			<Form.Input
				fluid
				placeholder='Category'
				type='text'
				value={this.state.category} 
				onChange={(e) => this.handleChange('category', e.target.value)}
			/>
			<Form.Input
				type='file'
				name='menuItems'
				onChange={this.imageSelectedHandler}
			/>
			<Form.Button fluid size='large' content='Submit'>Add Item</Form.Button>
			</Segment>
		</Form>
		)
	}
}

export default connect(mapStateToProps)(AddMenuItemForm)