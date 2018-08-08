import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import { updateTransactionWithRequestedAddon } from '../../actions/tickets-transactions'

const mapStateToProps = state => {

	const { token } = state.authReducer
	const { activeTicket } = state.ticketTrackingReducer
	return { token, activeTicket }

}

const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
	updateTransaction: (event, token, ticketId, addonData) => {
		event.preventDefault()
		dispatch(updateTransactionWithRequestedAddon(token, ticketId, addonData))
	},
})

class AddCustomAddonForm extends Component {
	
	state = {
		itemName: '',
		itemPrice: '',
		category: 'AddOn'		
	}

	handleChange = (key, value) => {
		this.setState({
			[key]: value
		})
	}
	
	render() {

		const { token, activeTicket } = this.props
		const { updateTransaction } = this.props

		return(
		<form onSubmit={(event) => updateTransaction(event, token, activeTicket._id, JSON.stringify(this.state))}>
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

const CustomAddonModal = props => {

	const { token, activeTicket } = props
	const { updateTransaction } = props

	return(
		<div>
			<Modal
				isOpen={props.modalType === 'CUSTOM_ADDON_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				>

				<AddCustomAddonForm 
					token={token}
					activeTicket={activeTicket}
					updateTransaction={updateTransaction}
				/>
				<button onClick={() => props.hideModal()}> Cancel </button>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomAddonModal)