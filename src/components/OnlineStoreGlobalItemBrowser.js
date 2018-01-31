import React, { Component } from 'react'
import { connect } from 'react-redux'

import { retrieveAllItemsForSale } from '../actions/marketplaces'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { marketplaceItems } = state.marketplaceItemsReducer
	return { token, marketplaceItems }
}

class OnlineStoreItemBrowser extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(retrieveAllItemsForSale())
	}
	generateItemPreviews() {

	}

	render() {
		return(
			<div>This is a collection of all of the items within our entire marketplace app</div>
			<div>Each item should have a link to the seller's store, as well as an option to send the item to the cart - a buy now button</div>
			<div>The top corner should have a cart icon, which can be clicked to show a relatively positioned dropdown preview (Similar to how we implemented dropdowns in CSS tuts from W3schools)</div>

		)
	}
}

export default connect(mapStateToProps)(OnlineStoreItemBrowser)