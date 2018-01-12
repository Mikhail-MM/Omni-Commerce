import React, { Component } from 'react'
import { Route, Switch, Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchMenuItems } from '../actions/menu-items'
// import { connect } from 'react-redux'
// import { withRouter } from 'react-router-dom'
import AddMenuItemForm from './AddMenuItemForm'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { menuItems } = state.menuItemsReducer 
	return { token, menuItems }

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
	
	iterateThruCategories() {
		const { menuItems } = this.props
		return Object.keys(menuItems).map(f => <div className={f}>{this.iterateThruObject(f)}</div>) 
	}

	iterateThruObject(currentKey) {
		const { menuItems } = this.props
		const selector = currentKey
  			
  			return menuItems[selector].map(item => <div className={selector} key={item._id} onClick={this.handleClicktoFetch.bind(this, item._id)}>{item.itemName}</div>)
	}

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


	// We will need a Socket.io component in componentDidMount() listening for ticket updates
	render() {
		const { match, token, menuItems } = this.props;
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
				{/*{menuItems && Object.entries(menuItems).map(uniqueObject => uniqueObject.map(item => console.log(item)))}
				{menuItems && console.log(Object.entries(menuItems))}*/}
				{menuItems && this.iterateThruObject()}
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