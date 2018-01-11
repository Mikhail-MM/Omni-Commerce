import React, { Component } from 'react'
import { Route, Switch, Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchMenuItems } from '../actions/menu-items'
// import { connect } from 'react-redux'
// import { withRouter } from 'react-router-dom'
import AddMenuItemForm from './AddMenuItemForm'

function mapStateToProps(state) {
	const { token } = state.authReducer
	return { token }

}

class Terminal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			// Do we need local state here?
		}
	}
	componentDidMount() {
		const { dispatch, token } = this.props
		console.log("Looking for employee token in Terminal componentDidMount")
		console.log(token)
		dispatch(fetchMenuItems(token));
	}
	// We will need a Socket.io component in componentDidMount() listening for ticket updates
	render() {
		const { match, token } = this.props;
		return(
			<div className="Page-Wrapper">
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
			 	  	<button> Open Ticket </button>
			 	  	<Link to={`${match.url}/addItem`}> Add Menu Item </Link>
			 	  	<button> Close Out </button>
			 	  </div>
				</div>

				<footer className="Footer-Options">
					<Link to='/'> Log Out </Link>
					<button> Settings </button> 
				</footer>
				<Route path={`${match.url}/addItem`} component={AddMenuItemForm} />
			</div>
		)
	}
}

export default connect(mapStateToProps)(Terminal);