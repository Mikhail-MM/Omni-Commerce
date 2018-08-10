import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../styles/UserPage.css'

import { routeToNode } from '../../actions/routing'

const filterItemsBySeller = (items, sellerID) => {
	// This fails if we do not ensure that the entire DB is loaded. If we refresh the page while the state is cleared (reset app and go straight to page without ladoing main essos splash) - it is empty
	return items.filter(item => item.sellerRef_id == sellerID)
}

const mapStateToProps = (state, ownprops) => {
	const { marketplaceItems } = state.marketplaceItemsReducer
	console.log(ownprops)
	console.log("Listing OwnProps in MapState of UserPage: ", ownprops)
	return {
		sellerItems: filterItemsBySeller(marketplaceItems, ownprops.match.params.id)
	} 
}

const mapDispatchToProps = dispatch => ({
	routeToMarketPlace: (node) => dispatch(routeToNode(node)),
})
class UserPage extends Component {
	state = {
		loading: true,
		userFullName: '',
		userAvatarURL: '',
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
						<div className='ui-card-infotext'>
							<h3 className="StoreItem-Header-Name"> {item.itemName} </h3>
							<p className="store-link" onClick={() => this.props.routeToMarketPlace(`/essos/user/${item.sellerRef_id}`)}> Posted By: {item.postedBy} </p>
							<p className="store-pricing"> ${item.itemPrice} </p>
						</div>
						<div className="cart-button button_no_border_radius" ><span> Add To Cart Icon </span> </div>
					</div>
				</div>
			)
		})
	}
	
	render() {
		const { sellerItems } = this.props
		console.log(this.props)
		return (
			<div className='user-page-wrapper'>
				<div className='main-user-header'>
					<div className='user-social-container' >
						<div className='user-avatar'>
						</div>
						<div className='user-name-blurb' />
						<div className='user-social-stats' />
					</div>
					<div className='user-menu-control-panel'>
					</div>
				</div>
				<div className='user-content-wrapper'>
					{ sellerItems && this.generateItemDOM() }
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)