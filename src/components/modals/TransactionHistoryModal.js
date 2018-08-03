import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import { fetchCurrentTicketDetails } from '../../actions/tickets-transactions'

const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
	fetchCurrentTicketDetails: (token, ticket_Id) => dispatch(fetchCurrentTicketDetails(token, ticket_Id)),
})

const mapStateToProps = state => {
	const { token } = state.authReducer
	const { tickets, activeTicket } = state.ticketTrackingReducer
	const { modalType } = state.modalReducer
	return { modalType, token, tickets, activeTicket }
}

const TransactionHistoryDisplay = props => {

	const { token, tickets, activeTicket, fetchCurrentTicketDetails } = props

	const mapTicketsToDOMByStatus = ticketStatus => {
			return tickets[ticketStatus].map(ticket => {
				return(
					<tr key={ticket._id} onClick={() => fetchCurrentTicketDetails(token, ticket._id)}>
						<td> {ticket.status} </td>
						<td> {ticket.createdBy} </td>
						<td> {moment(ticket.createdAt).format('h:mm:ss a')} </td>
						<td> $ {ticket.total} </td>
					</tr>
				)
			})
		}

		const generateTicketStatusMappings = () => {
			return( Object.keys(tickets).map(ticketStatus => {
				return( mapTicketsToDOMByStatus(ticketStatus) )
			}))
		}

		return (
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
					{ tickets && generateTicketStatusMappings() }
				</tbody>
			</table>
	)
}

const TransactionHistoryModal = props => {
	const { token, tickets, activeTicket, fetchCurrentTicketDetails } = props
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'DISPLAY_ALL_TRANSACTIONS'}
				style={modalStyle}
				contentLabel="Example Modal"
				>

				<TransactionHistoryDisplay 
					token={token}
					tickets={tickets}
					activeTicket={activeTicket}
					fetchCurrentTicketDetails={fetchCurrentTicketDetails}
				/>
				<button onClick={() => this.props.hideModal()}> Cancel </button>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistoryModal)