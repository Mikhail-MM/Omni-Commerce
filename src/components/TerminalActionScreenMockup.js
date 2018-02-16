import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Button, Icon } from 'semantic-ui-react'
import { setVisibleCategory, updateTransactionWithMenuItem, updateTicketStatus, updateTransactionWithSubdocRemoval } from '../actions/tickets-transactions'

import AddCustomAddonForm from './AddCustomAddonForm'
import Checkout from './Checkout'
import CashPaymentForm from './CashPaymentForm'

function mapStateToProps(state) {
	const { token, isAuthenticated } = state.authReducer
	const { menuItems, visibleCategory } = state.menuItemsReducer 
	const { activeTicket } = state.ticketTrackingReducer
	return { token, menuItems, visibleCategory, isAuthenticated, activeTicket }
}

class TerminalActionScreenMockup extends Component {
	constructor(props) {
		super(props)
		this.state = { 
			showCardPaymentForm: false, 
			showCashPaymentForm: false,
			showAddonScreen: false,
		 } // We may have to move this to Redux so that we can dispatch a hide event from the Stripe Payment Button

		this.handleAddonRequest = this.handleAddonRequest.bind(this)
		this.toggleCardPaymentFormUI = this.toggleCardPaymentFormUI.bind(this);
		this.toggleCashPaymentFormUI = this.toggleCashPaymentFormUI.bind(this);
	}
	

	buildMenuCategorySelection() {
		const { menuItems } = this.props
			return Object.keys(menuItems).map(j => {
				return <button key= {j} className="category-selection" onClick = {this.sendCategorySelectionDispatch.bind(this, j)}>{j}</button>})
	}	

	sendCategorySelectionDispatch(category) {
		const { dispatch } = this.props;
			dispatch(setVisibleCategory(category))
	}

	iterateThruCategories() {
		const { menuItems, visibleCategory } = this.props
		return Object.keys(menuItems).map(f => {
			const classCheck = visibleCategory == f ? "Show" : "Hide"
				return <div key={f} className={classCheck + " " + f}>{this.iterateThruObject(f)}</div>})
	}

	toggleCardPaymentFormUI(event) {
		event.preventDefault();
		this.setState({ showCardPaymentForm: true });
		console.log(this.state);
	}

	toggleCashPaymentFormUI(event) {
		event.preventDefault();
		this.setState({ showCashPaymentForm: true });
		console.log(this.state);
	}

	iterateThruObject(currentKey) {
		const { menuItems, token, activeTicket, dispatch } = this.props
		const selector = currentKey
  			return menuItems[selector].map(item => <div className={selector} key={item._id} onClick={this.handleClicktoFetch.bind(this, token, item._id, activeTicket._id, dispatch)}>{item.itemName}</div>)
	}

	handleClicktoFetch(token, menuItem_Id, currentTransaction_Id, dispatch) { 
		dispatch(updateTransactionWithMenuItem(token, menuItem_Id, currentTransaction_Id))
	}

	handleTicketStatusUpdate(token, status) {
		const { dispatch, activeTicket } = this.props
		console.log(status)
		dispatch(updateTicketStatus(token, activeTicket._id, status))
	}
	
	pullItemFromTicketItemsArray(token, item_Id, activeTicket_Id) {
		const { dispatch } = this.props
		console.log("Triggering request to pull out of Subdoc Array")
		console.log("Item ID:")
		console.log(item_Id)
		console.log("Transaction ID:")
		console.log(activeTicket_Id)
		dispatch(updateTransactionWithSubdocRemoval(token, item_Id, activeTicket_Id))
	}
	
	handleAddonRequest() {
		this.setState({showAddonScreen: true})
	}
	
	generateLedgerFromActiveTicket() {
		const { activeTicket, token } = this.props
		// Add unique option to only return Addon button on LAST element of the array
		return activeTicket.items.map((item, index, array) => {
			if (index == array.length - 1) {
				return (
					<Table.Row key={item._id}>
					 <Table.Cell><button onClick={this.pullItemFromTicketItemsArray.bind(this, token, item._id, activeTicket._id)}>Remove</button></Table.Cell>
					 <Table.Cell><button onClick={this.handleAddonRequest}>AddOn</button></Table.Cell>
					 <Table.Cell>{item.itemName}</Table.Cell>
					 <Table.Cell>${item.itemPrice}</Table.Cell>
					</Table.Row>
					)
			}
			return(
				<Table.Row key={item._id}>
				 <Table.Cell><button onClick={this.pullItemFromTicketItemsArray.bind(this, token, item._id, activeTicket._id)}>Remove</button></Table.Cell>
				 <Table.Cell></Table.Cell>
				 <Table.Cell>{item.itemName}</Table.Cell>
				 <Table.Cell>${item.itemPrice}</Table.Cell>
				</Table.Row>
			)
		})
	}
	displayPricingFromActiveTicket() {
		const { activeTicket } = this.props
		return(
		 <Table.Footer> 
		  <Table.Row>
		   <Table.HeaderCell colSpan="3">SubTotal</Table.HeaderCell>
		   <Table.Cell>${activeTicket.subTotal}</Table.Cell>
		  </Table.Row>
		  <Table.Row>
		   <Table.HeaderCell colSpan="3">Tax</Table.HeaderCell>
		   <Table.Cell>${activeTicket.tax}</Table.Cell>
		  </Table.Row>
		  <Table.Row>
		   <Table.HeaderCell colSpan="3">Total</Table.HeaderCell>
		   <Table.Cell>${activeTicket.total}</Table.Cell>
		  </Table.Row>
		  <Table.Row>
		   <Table.HeaderCell colSpan="3">Discount</Table.HeaderCell>
		   <Table.Cell>$0.00</Table.Cell>
		  </Table.Row>
		  </Table.Footer>
		)
	}
	render() {
		const { token, menuItems, activeTicket } = this.props
		const { showCardPaymentForm, showCashPaymentForm } = this.state
		
		return(
		<div className="action-screen-wrapper" >
			<div className="left-40" >

				<Table celled inverted selectable>
					
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell> Remove Item </Table.HeaderCell>
							<Table.HeaderCell> Add-On </Table.HeaderCell>
							<Table.HeaderCell> Item Name </Table.HeaderCell>
							<Table.HeaderCell> Price </Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{ activeTicket && this.generateLedgerFromActiveTicket() }
					</Table.Body>
						{activeTicket && this.displayPricingFromActiveTicket()}
				</Table>
			</div>
			
			<div className="right-60" >
				
				<div className="category-selection-container">
					
					<div className="category-navigation">
						{menuItems && this.buildMenuCategorySelection()}
					</div>
					<div className="menu-item-buttons">
						{menuItems && activeTicket && this.iterateThruCategories()}
					</div>
					<div className="action-buttons" >
						<button onClick={this.handleTicketStatusUpdate.bind(this, token, "Fired")}>Fire Ticket</button>
						<button onClick={this.handleTicketStatusUpdate.bind(this, token, "Void")}>Void Ticket</button>
						<button onClick={this.handleTicketStatusUpdate.bind(this, token, "Delivered")}>Order Delivered</button>
						<button onClick={this.toggleCashPaymentFormUI}>Pay With Cash</button>
						<button onClick={this.toggleCardPaymentFormUI}>Pay With Stripe</button>
						{showCardPaymentForm && <Checkout />}
						{showCashPaymentForm && <CashPaymentForm />}
						{ this.state.showAddonScreen && <AddCustomAddonForm/> }
					</div>				
				
				</div>							
			</div>		
		</div>
		)
	}
}

export default TerminalActionScreenMockup;