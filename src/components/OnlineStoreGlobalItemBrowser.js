import React, { Component } from 'react'
import { connect } from 'react-redux'

import { retrieveAllItemsForSale, retrieveItemById, pushItemIntoShoppingCart } from '../actions/marketplaces'
import { showModal } from '../actions/modals'

import ModalRoot from './ModalRoot'

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
					<button 
						onClick={this.confirmOrder.bind(this, item._id)}>
							Add Item To Cart
					</button>
				</div>
			)
		})
	}


	confirmOrder(itemId){
		const { dispatch } = this.props
		dispatch(retrieveItemById(itemId))
		dispatch(showModal('CONFIRM_CART_ADDITION', {}))
	}

	bringCurrentItemIntoFocus(itemId) {
		const { dispatch } = this.props
		dispatch(retrieveItemById(itemId))

	}

	render() {
		const { marketplaceItems } = this.props
		// If the modal backdrop is not wide enough, we will have to move this to the overview component and pass down an onclick thru props down to this to show the proper modal
		return(
			<div>
			<ModalRoot />
			<h3> All Items </h3>
			{marketplaceItems && this.generateItemPreviews()}
			</div>

		)
	}
}

export default connect(mapStateToProps)(OnlineStoreGlobalItemBrowser)