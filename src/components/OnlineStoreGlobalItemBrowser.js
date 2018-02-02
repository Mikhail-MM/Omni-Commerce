import React, { Component } from 'react'
import { connect } from 'react-redux'

import { retrieveAllItemsForSale, retrieveItemById, pushItemIntoShoppingCart } from '../actions/marketplaces'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { marketplaceItems, currentMarketplaceItem } = state.marketplaceItemsReducer
 
	return { token, marketplaceItems, currentMarketplaceItem }
}

class OnlineStoreGlobalItemBrowser extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
		this.generateItemPreviews = this.generateItemPreviews.bind(this)
	}

	componentDidMount() {
		const { dispatch } = this.props;
		console.log("Retrieving all items from Global Storefront Browser")
		dispatch(retrieveAllItemsForSale())
	}

	generateItemPreviews() {
		const { marketplaceItems } = this.props
		return marketplaceItems.map(item => {
			return(
				<div>
					<div 
						key={item._id}
						onClick={this.bringCurrentItemIntoFocus.bind(this, item._id)}>
							{item.itemName}
					</div>
					<input type="number" />
					<button 
						onClick={this.addItemToCart.bind(this, item._id)}>
							Add Item To Cart
					</button>
				</div>
			)
		})
	}

	addItemToCart(itemId) {
		const { dispatch, token } = this.props
		dispatch(pushItemIntoShoppingCart(token, itemId))
	}

	bringCurrentItemIntoFocus(itemId) {
		const { dispatch } = this.props
		dispatch(retrieveItemById(itemId))

	}

	render() {
		const { marketplaceItems } = this.props

		return(
			<div>
			{marketplaceItems && this.generateItemPreviews()}
			<div>This is a collection of all of the items within our entire marketplace app</div>
			<div>Each item should have a link to the seller's store, as well as an option to send the item to the cart - a buy now button</div>
			<div>The top corner should have a cart icon, which can be clicked to show a relatively positioned dropdown preview (Similar to how we implemented dropdowns in CSS tuts from W3schools)</div>
			</div>

		)
	}
}

export default connect(mapStateToProps)(OnlineStoreGlobalItemBrowser)