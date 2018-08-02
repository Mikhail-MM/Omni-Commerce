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
})

class TerminalActionScreen extends Component {
	state = {

	}

	const { token, isAuthenticated, menuItems, visibleCategory, activeTicket } = this.props

	// Category Selection Screen

	const generateItemCategoryVisibilityMenu = () => {

		return Object.keys(menuItems).map(category => {

			return <button key={category} onClick={() => this.props.setVisibleCategory(category)}> {category} </button>

		})
	}

	// Button Containers - Set to be Hidden or Visible by CSS Class

	const generateCategoryContainersByVisibility = () => {

		return Object.keys(menuItems).map(category => {
			
			const classCheck = (visibleCategory == category) ? 'Show' : 'Hide'

			return <div key={category} className={`${classCheck} ${category}`}> {this.mapTerminalItemsToDOM()} </div> 
		
		})
	}

	// Menu Buttons

	const mapTerminalItemsToDOM = category => {
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


	render() {
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
							<button onClick={() => this.props.showModal('CASH_PAYMENT_FORM')}>Pay With Cash</button>
							<button onClick={() => this.props.showModal('CARD_PAYMENT_FORM')}>Pay With Stripe</button>
						</div>
					</div>
					<div className='category-select-footer' >
						{ menuItems && this.generateItemCategoryVisibilityMenu() }
					</div>
				</div>
				<div className='ledger'>
					<div className='ledger-header'>
					</div>
					<div className='ledger-body'>
					</div>
					<div className='ledger-footer'>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TerminalActionScreen)