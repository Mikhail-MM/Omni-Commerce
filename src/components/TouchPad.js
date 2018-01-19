import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setVisibleCategory, updateTransactionWithMenuItem } from '../actions/menu-items'

function mapStateToProps(state) {
	const { token, isAuthenticated } = state.authReducer
	const { menuItems, visibleCategory } = state.menuItemsReducer 
	const { activeTicket } = state.ticketTrackingReducer
	return { token, menuItems, visibleCategory, isAuthenticated, activeTicket }
}


class TouchPad extends Component {
	constructor(props) {
		super(props)
		this.state = { }
	}
	
	buildMenuCategorySelection() {
		const { menuItems } = this.props
			return Object.keys(menuItems).map(j => {
				return <button key= {j} className="category-selection" onClick = {this.sendCategorySelectionDispatch.bind(this, j)}>{j}</button>})
	}	

	sendCategorySelectionDispatch(category) {
		const { dispatch } = this.props;
			dispatch(setVisibleCategory(category))
	}

	iterateThruCategories() {
		const { menuItems, visibleCategory } = this.props
		return Object.keys(menuItems).map(f => {
			const classCheck = visibleCategory == f ? "Show" : "Hide"
				return <div key={f} className={classCheck + " " + f}>{this.iterateThruObject(f)}</div>})
	}

	iterateThruObject(currentKey) {
		const { menuItems, token, activeTicket, dispatch } = this.props
		const selector = currentKey
  			return menuItems[selector].map(item => <div className={selector} key={item._id} onClick={this.handleClicktoFetch.bind(this, token, item._id, activeTicket._id, dispatch)}>{item.itemName}</div>)
	}

	handleClicktoFetch(token, menuItem_Id, currentTransaction_Id, dispatch) { 
		dispatch(updateTransactionWithMenuItem(token, menuItem_Id, currentTransaction_Id))
	}

	render() {
		const { menuItems, activeTicket } = this.props
		return(
		<div className="TouchPad-Component-Wrapper">
			 
			{menuItems && this.buildMenuCategorySelection()}
			{menuItems && activeTicket && this.iterateThruCategories()}
	
		 <footer className="Pagination-Navigation-Container">
		  <nav> 
		   {"Pagination Circles Here"}
		  </nav>
		 </footer>
	
		</div>
		)
	}
}

export default connect(mapStateToProps)(TouchPad)