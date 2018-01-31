import React, { Component } from 'react'
import { connect } from 'react-redux'

import { retrieveAllMarketplaces, retrieveMarketplaceById } from '../actions/marketplaces'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { allMarketplaces, currentMarketplace } = state.marketplaceBrowserReducer
	return { token, allMarketplaces, currentMarketplace }
}



class OnlineStorefrontBrowser extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}
	componentDidMount() {
		const { dispatch } = this.props
		dispatch(retrieveAllMarketplaces())	
	}
	generateMarketplacePortals() {
		// dispatch an action to route to OnlineStoreItemBrowser
	}
	bringMarketplaceIntoFocus(marketplaceId) {
		const { dispatch } = this.props
		dispatch(retreiveMarketplaceById(marketplaceId))
	}

	render() {
		return(
			<div> We should be showing portals to all marketplaces here </div>
			<div> Each store instance will have an onClick that brings that store into the current focus </div>
			<div> When a current store is within the focus, need to transition to a storeviewer and fetch the items of that store </div>
		)
	}
}

export default connect(mapStateToProps)(OnlineStorefrontBrowser)