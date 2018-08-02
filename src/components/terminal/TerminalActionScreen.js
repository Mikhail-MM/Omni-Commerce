import React, { Component } from 'react'
import '../styles/TerminalActionScreen.css'

import { showModal } from '../actions/modals'

import { 
	setVisibleCategory, 
	updateTransactionWithMenuItem, 
	updateTicketStatus, 
	updateTransactionWithSubdocRemoval 
} from '../actions/tickets-transactions'

const mapStateToProps = state => {

	const { token, isAuthenticated } = state.authReducer
	const { menuItems, visibleCategory } = state.menuItemsReducer 
	const { activeTicket } = state.ticketTrackingReducer

	return { token, menuItems, visibleCategory, isAuthenticated, activeTicket }

}

const mapDispatchToProps = dispatch => ({
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
	setVisibleCategory: (category) => dispatch(setVisibleCategory(category)),
	updateTransactionWithMenuItem: (token, itemId, ticketId) => dispatch(updateTransactionWithMenuItem(token, itemId, ticketId)),
	updateTicketStatus: (token, ticketId, status) => dispatch(updateTicketStatus(token, ticketId, status)),
	removeItemFromTicket: (token, subdocId, ticketId) => dispatch(updateTransactionWithSubdocRemoval(token, subdocId, ticketId)),
})

class TerminalActionScreen extends Component {
	state = {

	}

	// Category Selection Screen

	generateItemCategoryVisibilityMenu = () => {
		const { menuItems } = this.props

		return Object.keys(menuItems).map(category => {

			return <button key={category} onClick={() => this.props.setVisibleCategory(category)}> {category} </button>

		})
	}

	// Button Containers - Set to be Hidden or Visible by CSS Class

	generateCategoryContainersByVisibility = () => {
		const { menuItems, visibleCategory } = this.props

		return Object.keys(menuItems).map(category => {
			
			const classCheck = (visibleCategory == category) ? 'Show' : 'Hide'

			return <div key={category} className={`${classCheck} ${category}`}> {this.mapTerminalItemsToDOM()} </div> 
		
		})
	}

	// Menu Buttons

	mapTerminalItemsToDOM = category => {
		const { token, menuItems, activeTicket } = this.props

		menuItems[category].map(item => {
			return(
  				<div className="ui-pos-item" key={item._id} onClick={() => this.props.updateTransactionWithMenuItem(token, item._id, activeTicket._id)}>
  					<div className="ui-pos-item_image">
  						<img src={item.imageURL} />
  					</div>
  					<div className="ui-pos-item_content">
  						<div className="ui-pos-item-name">
							{item.itemName}
  						</div>
  						<div className="ui-pos-item-price">
  							{item.itemPrice}
  						</div>
  					</div>
				</div>				
			)
		})
	}

	// Ledger Rendering

	generateLedgerFromActiveTicket = () => {
		const { activeTicket, token } = this.props

		return activeTicket.items.map((item, index, array) => {
			if (index == array.length - 1) {
				return (
					<tr key={item._id}>
					 <td><button  color="black" onClick={() => this.props.removeItemFromTicket(token, item._id, activeTicket._id)}>Remove</button></td>
					 <td><button  color="black" onClick={() => this.props.showModal('CUSTOM_ADDON_MODAL', {})}>AddOn</button></td>
					 <td>{item.itemName}</td>
					 <td>${item.itemPrice}</td>
					</tr>
					)
			}
			return(
				<tr key={item._id}>
				 <td><button color="black" onClick={() => this.props.removeItemFromTicket(token, item._id, activeTicket._id)}>Remove</button></td>
				 <td></td>
				 <td>{item.itemName}</td>
				 <td>${item.itemPrice}</td>
				</tr>
			)
		})
	}

	displayPricingFromActiveTicket = () => {
		const { activeTicket, menuItems } = this.prop

		return(
			<div> {`SubTotal: ${activeTicket.subTotal}`} </div>
			<div> {`Tax: ${activeTicket.tax}`} </div>
			<div> {`Total: ${activeTicket.total}`} </div>
		)
	}

	render() {
		const { token, isAuthenticated, menuItems, visibleCategory, activeTicket } = this.props

		return(
			<div className='action-page-wrapper' >
				<div className='picker-column' >
					<div className='touchpad' >
						<div className='menu-item-buttons'>
							{ menuItems && activeTicket && this.generateCategoryContainersByVisibility() }
						</div>
						<div className='action-buttons'>
							<button onClick={() => this.props.updateTicketStatus(token, activeTicket._id, "Active")}>Fire Ticket</button>
							<button onClick={() => this.props.updateTicketStatus(token, activeTicket._id, "Void")}>Void Ticket</button>
							<button onClick={() => this.props.updateTicketStatus(token, activeTicket._id, "Delivered")}>Order Delivered</button>
							<button onClick={() => this.props.showModal('CASH_PAYMENT_FORM', {})}>Pay With Cash</button>
							<button onClick={() => this.props.showModal('CARD_PAYMENT_FORM', {})}>Pay With Stripe</button>
						</div>
					</div>
					<div className='category-select-footer' >
						{ menuItems && this.generateItemCategoryVisibilityMenu() }
					</div>
				</div>
			{ /* Need to switch classNames from DIVS to the Table elements */ }
				<div className='ledger'>
					<div className='ledger-header'>
						<table>
							<thead>
								<tr>
									<tr> Remove Item </tr>
									<tr> Add-On </tr>
									<tr> Item Name </tr>
									<tr> Price </tr>
								</tr>
							</thead>
							<tbody>
								{ activeTicket && this.generateLedgerFromActiveTicket() }
							</tbody>
						</table>
					</div>
					<div className='ledger-body'>

					</div>
					<div className='ledger-footer'>
						{ activeTicket && this.displayPricingFromActiveTicket() }
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TerminalActionScreen)