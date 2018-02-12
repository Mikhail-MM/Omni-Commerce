import React, { Component } from 'react'
import { Route, Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Icon, Form, Grid, Header, Image, Message, Segment, Label, Divider, Checkbox } from 'semantic-ui-react'

import { fetchMenuItems, fetchAllTicketsAndGenerateSalesReport, } from '../actions/menu-items'
import { fetchTickets, createNewTicket } from '../actions/tickets-transactions'
import { logOut, } from '../actions/auth-login'
import { fetchLoggedUsers } from '../actions/employees'
import { showModal } from '../actions/modals'

import ModalRoot from './ModalRoot'

// import { connect } from 'react-redux'
// import { withRouter } from 'react-router-dom'
import AddMenuItemForm from './AddMenuItemForm'
import ClockInOutForm from './ClockInOutForm'
import SalesAnalytics from './SalesAnalytics'

import { promiseTest } from '../actions/marketplaces'

// Recharts
function mapStateToProps(state) {
	const { loggedInUsers } = state.activeEmployeesReducer
	const { token, isAuthenticated } = state.authReducer
	const { menuItems, visibleCategory } = state.menuItemsReducer 
	const { tickets, activeTicket } = state.ticketTrackingReducer
	const { activeSalesReport } = state.salesReportReducer
	return { token, menuItems, tickets, visibleCategory, isAuthenticated, loggedInUsers, activeTicket, activeSalesReport }

}

class Terminal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectClockInScreen: false,
			selectClockOutScreen: false
			// Do we need local state here?
		}
		
		this.handleLogOut = this.handleLogOut.bind(this)
		this.generateSalesReport = this.generateSalesReport.bind(this)

		this.dispatchTransactionHistoryModal = this.dispatchTransactionHistoryModal.bind(this)
		this.dispatchAddItemModal = this.dispatchAddItemModal.bind(this)
		this.dispatchWaiterCallModal = this.dispatchWaiterCallModal.bind(this)
		this.dispatchClockInForm = this.dispatchClockInForm.bind(this)
		this.dispatchClockOutForm = this.dispatchClockOutForm.bind(this)


	}
	componentDidMount() {
		const { dispatch, token } = this.props
		console.log("Looking for employee token in Terminal componentDidMount")
		console.log(token)
		dispatch(fetchMenuItems(token));
		dispatch(fetchTickets(token));
		dispatch(fetchLoggedUsers(token));
	}
	handleLogOut() {
		const { dispatch } = this.props
		dispatch(logOut());
	}
	
	generateSalesReport() {
		const { token, dispatch } = this.props
		dispatch(fetchAllTicketsAndGenerateSalesReport(token))
	}

	dispatchWaiterCallModal() {
		const { dispatch } = this.props
		dispatch(showModal('SELECT_EMPLOYEE_OPENING_TICKET', {}))
	}
	dispatchTransactionHistoryModal() {
		const { dispatch } = this.props
		dispatch(showModal('DISPLAY_ALL_TRANSACTIONS', {}))
	}

	dispatchAddItemModal() {
		const { dispatch } = this.props
		dispatch(showModal('ADD_POINT_SALE_ITEM', {}))
	}

	dispatchClockInForm() {
		const { dispatch } = this.props
		const modalProps = {formSelector: "Clock In"}
		dispatch(showModal('EMPLOYEE_PUNCH_CLOCK_FORM_MODAL', modalProps))
	}

	dispatchClockOutForm() {
		const { dispatch } = this.props
		const modalProps = {formSelector: "Clock Out"}

		dispatch(showModal('EMPLOYEE_PUNCH_CLOCK_FORM_MODAL', modalProps))
	}

	render() {
		const { match, menuItems, isAuthenticated, tickets, activeTicket, token, activeSalesReport } = this.props;
		
		return(
			<div className="page-wrapper">
			<div className="terminal-nav-bar" >
			</div>
			{/*!isAuthenticated && <Redirect to='/login' /> */}
			<ModalRoot />
			<Segment inverted color='black' className='terminal-navigation-wrapper'>
			<div className='terminal-button-row'>
				<div className='terminal-button-row-internal-flex'>

					<Button inverted className='terminal-button' onClick={this.dispatchWaiterCallModal}>
						<Icon size='large'className='iconPosition' name='add square'/> Open New Ticket
					</Button>
					<Button inverted className='terminal-button' onClick={this.dispatchTransactionHistoryModal}>
						<Icon size='large'className='iconPosition' name='dollar' /> See All Transactions
					</Button>
					<Button inverted className='terminal-button' onClick={this.dispatchAddItemModal}>
						<Icon size='large'className='iconPosition' name='barcode' /> Add New Item
					</Button>
					<Button inverted className='terminal-button'>
						<Icon size='large'className='iconPosition' name='table' /> Modify Items
					</Button>

				</div>
			</div>

			<div className='terminal-button-row'>
				<div className='terminal-button-row-internal-flex'>
					<Button inverted className='terminal-button'>
						<Icon size='large'className='iconPosition' name='log out'/> Log Out
					</Button>
					<Button inverted className='terminal-button' onClick={this.dispatchClockInForm}>
						<Icon size='large'className='iconPosition' name='hourglass start'/> Clock In
					</Button>
					<Button inverted className='terminal-button' onClick={this.dispatchClockOutForm}>
						<Icon size='large'className='iconPosition' name='hourglass end'/> Clock Out
					</Button>
					<Button inverted className='terminal-button'>
						<Icon size='large'className='iconPosition' name='checkmark box' /> Close Out/Sales Report
					</Button>
				</div>
			</div>
			</Segment>			
			</div>
		)
	}
}

export default connect(mapStateToProps)(Terminal);
