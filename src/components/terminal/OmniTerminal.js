import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchMenuItems } from '../../actions/terminalItems'
import { fetchTickets } from '../../actions/tickets-transactions'
import { fetchLoggedUsers } from '../../actions/employees'
import { showModal } from '../actions/modals'

import  '../styles/OmniTerminal.css'

const mapStateToProps = (state) => {
	const { isAuthenticated, token } = state.authReducer;
	const { menuItems, visibleCategory } = state.terminalItemsReducer;
	const { tickets, activeTicket } = state.ticketTrackingReducer; 
	const { loggedInUsers } = state.employeeReducer

	return { isAuthenticated, token, menuITems, visibleCategory, tickets, activeTicket, loggedInUsers }
}


const mapDispatchToProps = (dispatch) => ({
	fetchMenuItems: (token) => dispatch(fetchMenuItems(token)),
	fetchTickets: (token) => dispatch(fetchTickets(token)),
	fetchLoggedUsers: (token) => dispatch(fetchLoggedUsers(token)),
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
})

class OmniTerminal extends Component {

	componentDidMount() {
		const { token } = this.props;

		this.props.fetchMenuItems(token);
		this.props.fetchTickets(token);
		this.props.fetchLoggedUsers(token);
	}

	render() {
		return(
			<div className='page-wrapper'>
				<div className='omni-terminal__centered-rectangle' >
					<div className='row-1-big'>
						<div className='mainframe-container'>
							<div className='graph' >
							</div>
							<div className='row__statistics'>
							</div>

						</div> 
						<div className='foursquare-container'>
							<div className='row__buttons'>
								<div className='button' onClick={() => this.props.showModal('EMPLOYEE_PUNCH_CLOCK_FORM_MODAL', {formSelector: "Clock In"})}>
									Clock In
								</div>
								<div className='button' onClick={() => this.props.showModal('EMPLOYEE_PUNCH_CLOCK_FORM_MODAL', {formSelector: "Clock Out"})}>
									Clock Out
								</div>
							</div>
							<div className='row__buttons'>
								<div className='button' onClick={() => this.props.showModal('ADD_POINT_SALE_ITEM', {})}>
									Add New Item
								</div>
								<div className='button' >
									Modify Items
								</div>
							</div>
						</div>
					</div>
					<div className='row-2'>
						<div className='button__lower' >
							New Transaction
						</div>
						<div className='button__lower'>
							View Transactions
						</div>
						<div className='button__lower'>
							Generate Sales Report
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OmniTerminal)