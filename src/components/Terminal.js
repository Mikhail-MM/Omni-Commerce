import React, { Component } from 'react'
import { Route, Switch, Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchMenuItems, fetchTickets, createNewTicket, setVisibleCategory } from '../actions/menu-items'
import { logOut,  fetchLoggedUsers } from '../actions/auth-login'
// import { connect } from 'react-redux'
// import { withRouter } from 'react-router-dom'
import AddMenuItemForm from './AddMenuItemForm'
import ClockInOutForm from './ClockInOutForm'

function mapStateToProps(state) {
	const { token, isAuthenticated, loggedInUsers } = state.authReducer
	const { menuItems, tickets, visibleCategory } = state.menuItemsReducer 
	return { token, menuItems, tickets, visibleCategory, isAuthenticated, loggedInUsers }

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
		return loggedInUsers.map(server => <div key={server} onClick={this.handleServerFetch.bind(this, token, server, dispatch)}>{server}</div>)
	}

	// We need to make a set of buttons that updates the state of this component. This will determine which Divs to show, and which Divs to hide.
	// Create a new DIV for each Key - Each Key is a Category for our items - from menuItems
	// Within each div, map through each array of items in that category key
	buildMenuCategorySelection() {
		const { menuItems } = this.props
		return Object.keys(menuItems).map(j => {
			return <button className="category-selection" onClick = {this.sendCategorySelectionDispatch.bind(this, j)}>{j}</button>
		})
	}
	sendCategorySelectionDispatch(category){
		const { dispatch } = this.props;
		dispatch(setVisibleCategory(category))
	}
	
	iterateThruCategories() {
		const { menuItems, visibleCategory } = this.props
		return Object.keys(menuItems).map(f => {
			const classCheck = visibleCategory == f ? "Show" : "Hide"
			return <div key={f} className={classCheck + " " + f}>{this.iterateThruObject(f)}</div>})}
	
	// Bind the onClick function to each item - allowing us to retrieve its _id
	iterateThruObject(currentKey) {
		const { menuItems } = this.props
		const selector = currentKey
  			
  			return menuItems[selector].map(item => <div className={selector} key={item._id} onClick={this.handleClicktoFetch.bind(this, item._id)}>{item.itemName}</div>)
	}

	handleClicktoFetch(id) { 
		console.log("_id of Clicked Element is: ", id);

	}

	handleServerFetch(token, name, dispatch){
		console.log("handleServerFetch firing (this bound in generateWaiterCallScreen function)")

		dispatch(createNewTicket(token, name))	
	}

	// We will need a Socket.io component in componentDidMount() listening for ticket updates
	render() {
		const { match, token, menuItems, isAuthenticated } = this.props;
		const { selectUser } = this.state
		return(
			<div className="Page-Wrapper">
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
			 	  	<button onClick={this.selectUserToCreateNewTicket}> Open Ticket </button>
			 	  	{selectUser && this.generateWaiterCallScreen()}
			 	  	<Link to={`${match.url}/addItem`}> Add Menu Item </Link>
			 	  	<button onClick={this.showClockInScreen}>Clock In</button>
			 	  	{this.state.selectClockInScreen && <ClockInOutForm option="Clock In"/> }
			 	  	<button onClick={this.showClockOutScreen}>Clock Out</button>
			 	  	{this.state.selectClockOutScreen && <ClockInOutForm option="Clock Out" />}
			 	  	<button> Close Out </button>
			 	  </div>
				</div>

				<footer className="Footer-Options">
					<Link to='/' onClick={this.handleLogOut}> Log Out </Link>
					<button> Settings </button> 
				</footer>
				<Route path={`${match.url}/addItem`} component={AddMenuItemForm} />
				{menuItems && this.buildMenuCategorySelection()}
				{/*{menuItems && Object.entries(menuItems).map(uniqueObject => uniqueObject.map(item => console.log(item)))}
				{menuItems && console.log(Object.entries(menuItems))}*/}
				{menuItems && this.iterateThruCategories()}
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