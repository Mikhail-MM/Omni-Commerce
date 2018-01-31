import React, { Component } from 'react'
import { connect } from 'react-redux'

import { retrieveItemsFromMarketplace } from '../actions/marketplaces'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { currentMarketplace } = state.marketplaceBrowserReducer
	const { marketplaceItems } = state.marketplaceItemsReducer
	return { token, currentMarketplace, marketplaceItems }
}

class OnlineStoreItemBrowser extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount() {
		const { dispatch, currentMarketplace } = this.props;
		dispatch(retrieveItemsFromMarketplace(currentMarketplace._id))
	}
	
	generateItemBuyScreen() {
		// dispatch 
	}

	render() {
		return(

		)
	}
}

export default connect(mapStateToProps)(OnlineStoreItemBrowser)