import React, { Component } from 'react'
import { connect } from 'react-redux'

import { routeToNode } from '../../actions/routing'
import { showModal } from '../../actions/modals'

const filterItemsBySeller = (items, sellerID) => {
	// This fails if we do not ensure that the entire DB is loaded. If we refresh the page while the state is cleared (reset app and go straight to page without ladoing main essos splash) - it is empty
	
	return items.filter(item => item.sellerRef_id == sellerID)
}

const mapStateToProps = (state, ownprops) => {
	const { marketplaceItems } = state.marketplaceItemsReducer
	console.log('Ownprops!!')
	console.log(ownprops)
	const userID = (ownprops.selfProfileView) ? ownprops.selfProfileID : ownprops.match.params.id
	console.log(userID)
	console.log(marketplaceItems)
	return {
		sellerItems: filterItemsBySeller(marketplaceItems,userID)
	} 
}

const mapDispatchToProps = dispatch => ({
	routeToMarketPlace: (node) => dispatch(routeToNode(node)),
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
})

class UserItemScreen extends Component {
	state = {

	}
	
	generateItemDOM = () => {
		const { sellerItems } = this.props
		this.props.setItemsLength(sellerItems.length)
		return sellerItems.map(item => {
			return (
				<div className="ui_card_mockup">
					<div className='ui_card_image'>
						<img src={item.imageURL} />
						<div className='card-image__hoverover'>
							{ this.props.selfProfileView && <button className='essos-delete-icon-container' onClick={() => this.props.showModal('CONFIRM_DELETE_MODAL', { module: 'Essos', itemData: item })}> X </button> }
						</div>
					</div>
					<div className='ui_card_content'>
						<div className='ui-card-infotext'>
							<h3 className="StoreItem-Header-Name"> {item.itemName} </h3>
							<p className="store-link" onClick={() => this.props.routeToMarketPlace(`/essos/user/${item.sellerRef_id}`)}> Posted By: {item.postedBy} </p>
							<p className="store-pricing"> ${item.itemPrice} </p>
						</div>
						<div 
							className="cart-button button_no_border_radius"
							onClick={() => (this.props.selfProfileView) ? this.props.showModal('DATABASE_INTERFACE_MODAL', {module: 'Essos', action: 'modify', modifyItemAttributes: item}) : this.props.showModal('CONFIRM_CART_ADDITION', {item: item})}
						>
							<span> Add To Cart </span> 
						</div>
					</div>
				</div>
			)
		})

	}

	render() {
		const { sellerItems } = this.props
		console.log(sellerItems)
		return(
		<div className='user-content-wrapper'>
			{ sellerItems && this.generateItemDOM() }
		</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserItemScreen)