import React, { Component } from 'react'
import { connect } from 'react-redux'

function mapStateToProps(state) {
	const { token } = state.authReducer
	return { token }

}

class AddMenuItemForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			itemName: '',
			itemPrice: '',
			category: ''
		}
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
		// Add to Redux?
		event.preventDefault()
		console.log(this.state);
		console.log(JSON.stringify(this.state));
		return fetch('http://localhost:3001/menus', {
			headers:{
				'Content-Type': 'application/json',
				'x-access-token': this.props.token
			},
				method: 'POST',
				mode: 'cors',
				body: JSON.stringify(this.state)
		})
		.then(res => res.json())
		.then(responseJSON => console.log(responseJSON));
	}

	render() {
		const { token } = this.props
		return(
		<form onSubmit={this.handleSubmit}>
			<label>
				Item:
				<input type='text' value={this.state.itemName} onChange={this.handleItemNameChange} />
			</label>
			<label>
				Price:
				<input type='text' value={this.state.itemPrice} onChange={this.handleItemPriceChange} />
			</label>
			<label>
				Category:
				<input type='text' value={this.state.category} onChange={this.handleCategoryChange} />
			</label>
			<input type="submit" value="Enter new Item" />
		</form>
		)
	}
}

export default connect(mapStateToProps)(AddMenuItemForm)