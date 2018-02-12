import React, { Component } from 'react'
import { connect } from 'react-redux'

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
			return ( <div key={ticketStatusCategory} className="TODOClassCheck"> 
						{ this.iterateThruTicketsByStatus(ticketStatusCategory) }
					 </div>
			)
		}))
	}

	// Change naming convention to something like Generate DOM
	iterateThruTicketsByStatus(ticketStatusCategory) {
		const { token, tickets, dispatch } = this.props

		return ( tickets[ticketStatusCategory].map(ticket => {
			return ( <div className={ticketStatusCategory} key={ticket._id} onClick={this.loadActiveTicket.bind(this, token, ticket._id, dispatch)}>
						{ticket.status} Ticket {ticket._id}
					 </div>
			)
		}))
	}

	loadActiveTicket(token, ticket_Id, dispatch) {
		dispatch(fetchCurrentTicketDetails(token, ticket_Id))
	}

	render() {
		const { tickets } = this.props
		return (
			<div>
			{ tickets && this.iterateThruTicketStatusCategories() }
			</div>
		)
	}

}

export default connect(mapStateToProps)(TransactionHistoryDisplay)