import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import moment from 'moment'

import { fetchCurrentTicketDetails } from '../actions/tickets-transactions'

function mapStateToProps(state) {
	const { token } = state.authReducer;
	const { tickets, activeTicket } = state.ticketTrackingReducer;
	return { tickets, activeTicket, token }
}

class TransactionHistoryDisplay extends Component {
	constructor(props) {
		super(props)
		this.iterateThruTicketStatusCategories = this.iterateThruTicketStatusCategories.bind(this)
		this.iterateThruTicketsByStatus = this.iterateThruTicketsByStatus.bind(this)
		this.loadActiveTicket = this.loadActiveTicket.bind(this)
	}

	// organize ticket keys is a better name for this
	iterateThruTicketStatusCategories() {
		const { tickets } = this.props;

		return ( Object.keys(tickets).map(ticketStatusCategory => {
			return ( this.iterateThruTicketsByStatus(ticketStatusCategory) )
		}))
	}

	// Change naming convention to something like Generate DOM
	iterateThruTicketsByStatus(ticketStatusCategory) {
		const { token, tickets, dispatch } = this.props

		return ( tickets[ticketStatusCategory].map(ticket => {
			return ( 
					<Table.Row key={ticket._id} onClick={this.loadActiveTicket.bind(this, token, ticket._id, dispatch)}>
						<Table.Cell> {ticket.status} </Table.Cell>
						<Table.Cell> {ticket.createdBy} </Table.Cell>
						<Table.Cell> {moment(ticket.createdAt).format('h:mm:ss a')} </Table.Cell>
						<Table.Cell> $ {ticket.total} </Table.Cell>
					</Table.Row>
			)
		}))
	}

	loadActiveTicket(token, ticket_Id, dispatch) {
		dispatch(fetchCurrentTicketDetails(token, ticket_Id))
	}

	render() {
		const { tickets } = this.props
		return (

				<Table celled inverted selectable>
					
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell> Ticket Status </Table.HeaderCell>
							<Table.HeaderCell> Server </Table.HeaderCell>
							<Table.HeaderCell> Time Created </Table.HeaderCell>
							<Table.HeaderCell> Total Charge </Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{ tickets && this.iterateThruTicketStatusCategories() }
					</Table.Body>
				</Table>
		)
	}

}

export default connect(mapStateToProps)(TransactionHistoryDisplay)