import React, { Component } from 'react'
import { Route, Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchMenuItems, fetchTickets, createNewTicket, setVisibleCategory, fetchAllTicketsAndGenerateSalesReport, updateTransactionWithMenuItem, fetchCurrentTicketDetails } from '../actions/menu-items'
import { logOut,  fetchLoggedUsers } from '../actions/auth-login'
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
	const { token, isAuthenticated, loggedInUsers } = state.authReducer
	const { menuItems, visibleCategory } = state.menuItemsReducer 
	const { tickets, activeTicket } = state.ticketTrackingReducer
	const { activeSalesReport } = state.salesReportReducer
	return { token, menuItems, tickets, visibleCategory, isAuthenticated, loggedInUsers, activeTicket, activeSalesReport }

}

class Terminal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentlyLoggedIn: ['Stacy', 'John', 'Blake'],
			selectUser: false,
			selectClockInScreen: false,
			selectClockOutScreen: false
			// Do we need local state here?
		}
		this.selectUserToCreateNewTicket = this.selectUserToCreateNewTicket.bind(this)
		this.showClockInScreen = this.showClockInScreen.bind(this)
		this.showClockOutScreen = this.showClockOutScreen.bind(this)
		this.handleLogOut = this.handleLogOut.bind(this)
		this.iterateThruTicketStatusCategories = this.iterateThruTicketStatusCategories.bind(this)
		this.generateSalesReport = this.generateSalesReport.bind(this)
		this.showExampleModal = this.showExampleModal.bind(this)
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
	showClockInScreen() {
		this.setState(
			Object.assign({}, ...this.state, {selectClockInScreen: true}))
	}	
	showClockOutScreen() {
		this.setState(
			Object.assign({}, ...this.state, {selectClockOutScreen: true}))
	}
	selectUserToCreateNewTicket() {
		this.setState(
			Object.assign({}, ...this.state, {selectUser: true}))
	}
	
	generateWaiterCallScreen() {
		const { token, loggedInUsers, dispatch } = this.props
		if (loggedInUsers) return loggedInUsers.map(server => <div key={server} onClick={this.postNewTicketByServerName.bind(this, token, server, dispatch)}>{server}</div>)
		else return console.log("There are no logged-in users! Consider allowing a catch-all general order call-in")
	}
	postNewTicketByServerName(token, name, dispatch){
		dispatch(createNewTicket(token, name))	
	}
	generateSalesReport() {
		const { token, dispatch } = this.props
		dispatch(fetchAllTicketsAndGenerateSalesReport(token))
	}

	// TODO: Componentize
	iterateThruTicketStatusCategories() {
		const { tickets } = this.props;
		return Object.keys(tickets).map(ticketKey => {
			return <div key={ticketKey} className="TODOClassCheck">{this.iterateThruTicketsByStatus(ticketKey)}</div>
		})
	}

	iterateThruTicketsByStatus(ticketKey) {
		const { token, tickets, dispatch } = this.props
		const selector = ticketKey
			return tickets[selector].map(ticket => <div className={selector} key={ticket._id} onClick={this.loadActiveTicket.bind(this, token, ticket._id, dispatch)}>{ticket.status} Ticket {ticket._id}</div>)
	}


	loadActiveTicket(token, ticket_Id, dispatch) {
		dispatch(fetchCurrentTicketDetails(token, ticket_Id))
	}

	showExampleModal() {
		const { dispatch } = this.props
		//dispatch(showModal('EXAMPLE_MODAL', {}))
		dispatch(promiseTest())
	}

	// We will need a Socket.io component in componentDidMount() listening for ticket updates
	render() {
		const { match, menuItems, isAuthenticated, tickets, activeTicket, token, activeSalesReport } = this.props;
		const { selectUser } = this.state
		// This is a general purpose terminal for our employees. Just keep it a big centered modal with Top, Left : 50%. So it's just a giant section with buttons, and a grid inside. EASY! 
		return(
			<div className="Page-Wrapper">
			<ModalRoot />
			{!isAuthenticated && <Redirect to='/login' />}
			 	<header className="Logo-Time-Header">
			 	<p> This could be a component</p>
			 	</header>
			 
			 	<div className="Main-Terminal-Wrapper">
			 	  <div className="Column-Left-75">
				 	  <header className="Admin-Options">{"Conditional Rendering of Admin Terminal - Live Updates - See Employees"}</header>
				 	  <div className="Ticket-Window-With-Scroll">
				 	  	<button className="Button-Styling"> A whole load of buttons </button>
				 	  	<p> We could turn this ticket window into a component - conditionally render these tickets, or alternatively render employee management screen or transaction history using JSX, depending on the UI State stored in Redux, which itself is dispatched by the admin terminal buttons</p>
				 	  </div>
			 	  </div>
			 	  <div className="Column-Right-25">
			 	  	<button onClick={this.showExampleModal}> Example Modal </button>
			 	  	<button onClick={this.selectUserToCreateNewTicket}> Open Ticket </button>
			 	  	{selectUser && this.generateWaiterCallScreen()}
			 	  	<Link to={`${match.url}/addItem`}> Add Menu Item </Link>
			 	  	<button onClick={this.showClockInScreen}>Clock In</button>
			 	  	{this.state.selectClockInScreen && <ClockInOutForm option="Clock In"/> }
			 	  	<button onClick={this.showClockOutScreen}>Clock Out</button>
			 	  	{this.state.selectClockOutScreen && <ClockInOutForm option="Clock Out" />}
			 	  	<button onClick={this.generateSalesReport}> Close Out </button>
			 	  </div>
				</div>

				<footer className="Footer-Options">
					<Link to='/' onClick={this.handleLogOut}> Log Out </Link>
					<button> Settings </button> 
				</footer>
				<Route path={`${match.url}/addItem`} component={AddMenuItemForm} />
				{tickets && this.iterateThruTicketStatusCategories()} 
				<SalesAnalytics/>
			</div>
		)
	}
}

export default connect(mapStateToProps)(Terminal);

/* Previously Attempted Iterator Functions

		handleClicktoFetch(id) {
		console.log("_id of Clicked Element is: ", id);

	}

	iterateThruObject() {
		const { menuItems } = this.props

		return Object.keys(menuItems).map((k) => {
			console.log(k);
  			return menuItems[k].map(item => <div className={k} key={item._id} onClick={this.handleClicktoFetch.bind(this, item._id)}>{item.itemName}</div>)
		})
	}

Current

	iterateThruCategories() {
		const { menuItems } = this.props
		return Object.keys(menuItems).map(f => <div className={f}>{this.iterateThruObject(f)}</div>) 
	}

	iterateThruObject(currentKey) {
		const { menuItems } = this.props
		const selector = currentKey
  			
  			return menuItems[selector].map(item => <div className={selector} key={item._id} onClick={this.handleClicktoFetch.bind(this, item._id)}>{item.itemName}</div>)
	}



*/