import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setVisibleCategory, updateTransactionWithMenuItem, updateTicketStatus } from '../actions/menu-items'

import Checkout from './Checkout'
import CashPaymentForm from './CashPaymentForm'

function mapStateToProps(state) {
	const { token, isAuthenticated } = state.authReducer
	const { menuItems, visibleCategory } = state.menuItemsReducer 
	const { activeTicket } = state.ticketTrackingReducer
	return { token, menuItems, visibleCategory, isAuthenticated, activeTicket }
}


class TouchPad extends Component {
	constructor(props) {
		super(props)
		this.state = { 
			showCardPaymentForm: false, 
			showCashPaymentForm: false,
		 } // We may have to move this to Redux so that we can dispatch a hide event from the Stripe Payment Button
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

	render() {
		const { token, menuItems, activeTicket } = this.props
		const fired = "Fired"
		const cancelled = "Void"
		const delivered = "Delivered"
		const { showCardPaymentForm, showCashPaymentForm } = this.state
		return(
		<div className="TouchPad-Component-Wrapper">
			 
			{menuItems && this.buildMenuCategorySelection()}
			{menuItems && activeTicket && this.iterateThruCategories()}
			<button onClick={this.handleTicketStatusUpdate.bind(this, token, "Fired")}>Fire Ticket</button>
			<button onClick={this.handleTicketStatusUpdate.bind(this, token, "Void")}>Void Ticket</button>
			<button onClick={this.handleTicketStatusUpdate.bind(this, token, "Delivered")}>Order Delivered</button>
			<button onClick={this.toggleCashPaymentFormUI}>Pay With Cash</button>
			<button onClick={this.toggleCardPaymentFormUI}>Pay With Stripe</button>
			{showCardPaymentForm && <Checkout />}
			{showCashPaymentForm && <CashPaymentForm />}
	
		</div>
		)
	}
}

export default connect(mapStateToProps)(TouchPad)