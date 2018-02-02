import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import OnlineStorefrontBrowser from './OnlineStorefrontBrowser'
import OnlineStoreGlobalItemBrowser from './OnlineStoreGlobalItemBrowser'
import AddMarketplaceItemForm from './AddMarketplaceItemForm'
import ShoppingCart from './ShoppingCart'

function mapStateToProps(state) {
	const { token, isAuthenticated } = state.authReducer
	const { currentMarketplace } = state.marketplaceBrowserReducer
	return { token, isAuthenticated, currentMarketplace }
}

class OnlineMerchantDashboard extends Component {
	constructor(props){
		super(props)
		this.state = {

		}
	}

	render() {
		const { isAuthenticated, currentMarketplace } = this.props
		return(
			<div>
			{ !isAuthenticated && <Redirect to='/login' /> }
			
			<div>
				<h1>All Marketplaces</h1>
				<OnlineStorefrontBrowser />
				<h1>All Items</h1>
				<OnlineStoreGlobalItemBrowser />
				<h2>Add Item Form</h2>
				<AddMarketplaceItemForm />
				{ isAuthenticated && <ShoppingCart /> }
				{/*
				NOTE: We absolutely CAN'T have the SPECIFIC STORE ITEM VIEW alongside GLOBAL ALL ITEM VIEW....We will send conflicting Receive Items dispatches
				{ currentMarketplace &&
					<div>
						<h3>Current Marketplace Items</h3>
						<OnlineStoreMarketplaceSpecificItemBrowser>
					</div> }
					*/}

			</div>
			</div>
		)
	}
}

export default connect(mapStateToProps)(OnlineMerchantDashboard)