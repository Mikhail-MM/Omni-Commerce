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
			category: ''
		}

		this.state = this.initialState

		this.handleItemNameChange = this.handleItemNameChange.bind(this);
		this.handleItemPriceChange = this.handleItemPriceChange.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleItemNameChange(event) {
		event.preventDefault()
		this.setState(
			Object.assign({}, ...this.state, {itemName: event.target.value}))
	}

	handleItemPriceChange(event) {
		event.preventDefault()
		this.setState(
			Object.assign({}, ...this.state, {itemPrice: event.target.value}))
	}

	handleCategoryChange(event) {
		event.preventDefault()
		this.setState(
			Object.assign({}, ...this.state, {category: event.target.value}))
	}

	handleSubmit(event) {
		const { token, dispatch } = this.props
		event.preventDefault()
		console.log(this.state);
		const data = JSON.stringify(this.state)
		dispatch(createNewMenuItem(token, data))
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
				onChange={this.handleItemNameChange}
			/>
			<Form.Input
				fluid
				placeholder='Item Price'
				type='text'
				value={this.state.itemPrice} 
				onChange={this.handleItemPriceChange}
			/>
			<Form.Input
				fluid
				placeholder='Category'
				type='text'
				value={this.state.category} 
				onChange={this.handleCategoryChange}
			/>
			<Form.Button fluid size='large' content='Submit'>Add Item</Form.Button>
			</Segment>
		</Form>
		)
	}
}

export default connect(mapStateToProps)(AddMenuItemForm)