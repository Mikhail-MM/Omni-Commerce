import React, { Component } from 'react'
import { connect } from 'react-redux'

import { createNewMenuItem } from '../../actions/terminalItems'

const initialState = {
	itemName: '',
	itemPrice: '',
	category: '',
	selectedFile: null
}

const mapStateToProps = (state) => {
	const { token } = state.authReducer
	return { token }

}

const mapDispatchToProps = (dispatch) => ({
	addItemToTerminal: (token, itemData, imageFile) => dispatch(createNewMenuItem(token, itemData, imageFile))
})

class AddMenuItemForm extends Component {
	
	state = initialState

	handleChange = (input, value) => {
		this.setState({
			[input]: value
		})
	}


	imageSelectedHandler = (event) => {
		console.log(event.target.files[0])
		this.setState({selectedFile: event.target.files[0]})
	}

	handleSubmit = (event) => {
		const { token } = this.props;
		const { itemName, itemPrice, category } = this.state;
		
		event.preventDefault();
		
		const jsonData = { 
			itemName,
			itemPrice,
			category
		}

		this.props.addItemToTerminal(token, jsonData, this.state.selectedFile);
		
		this.setState(this.initialState);

	}

	render() {
		return(
		<form onSubmit={this.handleSubmit}>
			<div className="addItemModalForm">
				<input
					placeholder='Item Name'
					type='text'
					value={this.state.itemName} 
					onChange={(e) => this.handleChange('itemName', e.target.value)}
				/>
				<input
					placeholder='Item Price'
					type='text'
					value={this.state.itemPrice} 
					onChange={(e) => this.handleChange('itemPrice', e.target.value)}
				/>
				<input
					placeholder='Category'
					type='text'
					value={this.state.category} 
					onChange={(e) => this.handleChange('category', e.target.value)}
				/>
				<input
					type='file'
					name='menuItems'
					onChange={this.imageSelectedHandler}
				/>
				<button content='Submit'>Add Item</button>
			</div>
		</form>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMenuItemForm)