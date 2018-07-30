import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Icon, Button, Image } from 'semantic-ui-react'

import { retrieveItemsFromMarketplace, retrieveItemById } from '../actions/marketplaces'
import { showModal } from '../actions/modals'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { currentMarketplace } = state.marketplaceBrowserReducer
	const { marketplaceItems } = state.marketplaceItemsReducer
	const { selected } = state.marketplaceFilterReducer
	const { searchTerm } = state.searchItemsReducer
	return { token, currentMarketplace, marketplaceItems, selected, searchTerm }
}

class OnlineStoreMarketplaceSpecificItemBrowser extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
		this.renderMarketplaceItems = this.renderMarketplaceItems.bind(this)
		this.confirmOrder = this.confirmOrder.bind(this)
	}

	
	renderMarketplaceItems() {
		const { marketplaceItems, selected, searchTerm } = this.props

		let filteredItems;
		let filteredSearchItems;

		if (selected.length > 0 ) {
			filteredItems = marketplaceItems.filter(item => {
				let filterMatch;
				let tag;
				for (tag of item.tags) {
					if (selected.includes(tag)) {
						return true
					}
				}
				return false
			})
		} else {
			filteredItems = marketplaceItems
		}

		if (searchTerm) {
			filteredSearchItems = filteredItems.filter(item => {
				if (item.itemName.toLowerCase().indexOf(searchTerm) !== -1) {
					return true
				}
				return false
			})
		}

		const toRender = (searchTerm !== null) ? filteredSearchItems : filteredItems

		return toRender.map(item => {
			return (<div className="ui_card_mockup">
						<div className='ui_card_image'>
							<img src={item.imageURL} />
						</div>
						<div className='ui_card_content'>
							<h3 className="StoreItem-Header-Name"> {item.itemName} </h3>
							<p className="stock-count"> In Stock: {item.numberInStock} </p>
							<p className="store-pricing"> ${item.itemPrice} </p>
							<Button className="button_no_border_radius" fluid><Icon name='add to cart' /> Add To Cart </Button>
						</div>
					</div>
					)

		})
	}

	confirmOrder(itemId){
		const { dispatch } = this.props
		dispatch(retrieveItemById(itemId))
		dispatch(showModal('CONFIRM_CART_ADDITION', {}))
	}

	render() {
		const { marketplaceItems } = this.props
		return(
			<div className="dynamic_cards"> {marketplaceItems && this.renderMarketplaceItems()} </div>
		)
	}
}

export default connect(mapStateToProps)(OnlineStoreMarketplaceSpecificItemBrowser)