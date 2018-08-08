import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../styles/UserPage.css'

const filterItemsBySeller = (items, sellerID) => {
	return items.filter(item => item._id == sellerID)
}

const mapStateToProps = (state, ownprops) => {
	const { marketplaceItems } = state.marketplaceItemsReducer
	console.log("Listing OwnProps in MapState of UserPage: ", ownprops)
	return {
		sellerItems: filterItemsBySeller(marketplaceItems, ownprops.params.id)
	}
}

class UserPage extends Component {
	state = {
		userAvatarURL: ''
	}

	generateItemDOM = () => {
		
		const { sellerItems } = this.props

		return sellerItems.map(item => {
			return (
				<div className="ui_card_mockup">
					<div className='ui_card_image'>
						<img src={item.imageURL} />
					</div>
					<div className='ui_card_content'>
						<h3 className="StoreItem-Header-Name"> {item.itemName} </h3>
						<p className="store-link" onClick={() => this.props.routeToMarketplace(`/essos/user/${item._sellerRef_id}`)}> Posted By: {item.postedBy} </p>
						<p className="store-pricing"> ${item.itemPrice} </p>
						<button className="button_no_border_radius" ><span> Add To Cart Icon </span> </button>
					</div>
				</div>
			)
		})
	}
	
	render() {
		const { sellerItems } = this.props
		return (
			<div className='user-page-wrapper'>
				<div className='main-user-header'>
				</div>
				<div className='user-content-wrapper'>

				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps)(UserPage)