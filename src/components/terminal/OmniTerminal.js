import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { routeToNode } from '../../actions/routing'
import { fetchMenuItems } from '../../actions/terminalItems'
import { fetchTickets, fetchCurrentTicketDetails } from '../../actions/tickets-transactions'
import { fetchLoggedUsers } from '../../actions/employees'
import { showModal } from '../../actions/modals'

import ModalRoot from '../ModalRoot'

import  '../styles/OmniTerminal.css'

const mapStateToProps = (state) => {
	const { isAuthenticated, token } = state.authReducer;
	const { menuItems, visibleCategory } = state.terminalItemsReducer;
	const { tickets, activeTicket } = state.ticketTrackingReducer; 
	const { loggedInUsers } = state.employeeReducer

	return { isAuthenticated, token, menuItems, visibleCategory, tickets, activeTicket, loggedInUsers }
}


const mapDispatchToProps = (dispatch) => ({
	fetchMenuItems: (token) => dispatch(fetchMenuItems(token)),
	fetchTickets: (token) => dispatch(fetchTickets(token)),
	fetchLoggedUsers: (token) => dispatch(fetchLoggedUsers(token)),
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
	routeToNode: (node) => dispatch(routeToNode(node))
})

class OmniTerminal extends Component {

	componentDidMount() {
		const { token } = this.props;

		this.props.fetchMenuItems(token);
		this.props.fetchTickets(token);
		this.props.fetchLoggedUsers(token);
	}

	mapTicketsToDOMByStatus = ticketStatus => {
		const { tickets, token } = this.props
		return tickets[ticketStatus].map(ticket => {
			return(
				<tr 
					key={ticket._id} 
					onClick={() => {
						fetchCurrentTicketDetails(token, ticket._id)}
					}
				>
					<td> {ticket.status} </td>
					<td> {ticket.createdBy} </td>
					<td> {moment(ticket.createdAt).format('h:mm:ss a')} </td>
					<td> $ {ticket.total} </td>
				</tr>
			)
		})
	}

	generateTicketStatusMappings = () => {
		const { tickets } = this.props
		return(Object.keys(tickets).map(ticketStatus => {
			return( this.mapTicketsToDOMByStatus(ticketStatus) )
		}))
	}

	render() {
		const { tickets } = this.props
		return(
			<div className='page-wrapper'>
				<ModalRoot />
				<div className='omni-terminal__centered-rectangle' >
					<div className='row-1-big'>
						<div className='mainframe-container'>
							<div className='graph' >
										<table>
											<thead>
												<tr>
													<th> Ticket Status </th>
													<th> Created By </th>
													<th> Time Created </th>
													<th> Total Charge </th>
												</tr>
											</thead>
											<tbody>
												{ tickets && this.generateTicketStatusMappings() }
											</tbody>
										</table>
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
								<div className='button' onClick={() => this.props.showModal('DATABASE_INTERFACE_MODAL', { module:'Omni', action: 'upload' })}>
									Add New Item
								</div>
								<div className='button' onClick={() => this.props.routeToNode('/omni/terminal/modifyItems')} >
									Modify Items
								</div>
							</div>
						</div>
					</div>
					<div className='row-2'>
						<div className='button__lower' onClick={() => this.props.showModal('SELECT_EMPLOYEE_OPENING_TICKET', {})}>
							New Transaction
						</div>
						<div className='button__lower' onClick={() => this.props.showModal('DISPLAY_ALL_TRANSACTIONS', {})}>
							View Transactions
						</div>
						<div className='button__lower' onClick={() => this.props.showModal('CONFIRM_END_OF_BUSINESS_DAY', {})}>
							Generate Sales Report
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OmniTerminal)