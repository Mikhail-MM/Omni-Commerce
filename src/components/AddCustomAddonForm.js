import React, { Component } from 'react'
import { updateTransactionWithRequestedAddon } from '../actions/menu-items'
import { connect } from 'react-redux'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { activeTicket } = state.ticketTrackingReducer
	return { token, activeTicket }

}

class AddMenuItemForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			itemName: '',
			itemPrice: '',
			category: 'AddOn'
		}
		this.handleItemNameChange = this.handleItemNameChange.bind(this);
		this.handleItemPriceChange = this.handleItemPriceChange.bind(this);
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



	handleSubmit(event) {
		// Add to Redux?
		const { token, activeTicket, dispatch } = this.props
		event.preventDefault()
		console.log(this.state);
		const data = JSON.stringify(this.state)
		dispatch(updateTransactionWithRequestedAddon(token, activeTicket._id, data))
	}

	render() {
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
			<input type="submit" value="Enter new Item" />
		</form>
		)
	}
}

export default connect(mapStateToProps)(AddMenuItemForm)