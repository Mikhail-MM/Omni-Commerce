import React, { Component } from 'react'
import { connect } from 'react-redux'
import './styles/EssosMarket.css';

import ModalRoot from './ModalRoot'

import { retrieveAllItemsForSale, addItemToWishlist, getUserWishlist } from '../actions/marketplace'
import { retrieveShoppingCart } from '../actions/shopping-cart'
import { getUserSocialFeed } from '../actions/social'
import { showModal } from '../actions/modals'
import { routeToNode } from '../actions/routing'

const mapStateToProps = state => {
	const { token, isAuthenticated } = state.authReducer
	const { marketplaceItems } = state.marketplaceItemsReducer
	const { shoppingCart } = state.shoppingCartReducer
	const { wishlist } = state.wishlistReducer

	return { token, isAuthenticated, marketplaceItems, shoppingCart, wishlist }
}

const mapDispatchToProps = dispatch => ({
	retrieveAllMarketplaceItems: () => dispatch(retrieveAllItemsForSale()),
	retrieveShoppingCart: (token) => dispatch(retrieveShoppingCart(token)),
	retrieveUserWishlist: (token) => dispatch(getUserWishlist(token)),
	getUserSocialFeed: (token) => dispatch(getUserSocialFeed(token)),
	wishlistAction: (token, itemId, mode) => dispatch(addItemToWishlist(token, itemId, mode)),
	routeToNode: (node) => dispatch(routeToNode(node)),
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
})

class EssosMarket extends Component {
	state = {
		activeJumbo: null
	}
	componentDidMount() {
		const { isAuthenticated, token } = this.props
		this.props.retrieveAllMarketplaceItems()
		if (isAuthenticated) this.props.retrieveShoppingCart(token)
		if (isAuthenticated) this.props.retrieveUserWishlist(token)
		if (isAuthenticated) this.props.getUserSocialFeed(token)
	}
	
	handleWishlistClick = (itemId) => {
		const { token, wishlist } = this.props
		const alreadyInWishlist = wishlist.find(item => item.itemId == itemId)
		if (!wishlist) return console.log("No wishlist on this account")
		if (!alreadyInWishlist) { return this.props.wishlistAction(token, itemId, 'add')
		} else if (alreadyInWishlist) { return this.props.wishlistAction(token, itemId, 'remove')}
	}

	handleWishlistIcon = (itemId) => {
		const { wishlist } = this.props
		if (!wishlist) { 
			return 'wishlist-icon-container' 
		} else if (wishlist.find(item => item.itemId == itemId)) {
			return 'wishlist-icon-container active-wish'
		} else { 
			return 'wishlist-icon-container' 
		}
	}

	generateReviewHoveroverContainer = (reviews) => {
		if (reviews.length < 1) return
		const totalScore = reviews.map(userReview => userReview.rating).reduce((acc, cur) => acc + cur)
		const average = totalScore / reviews.length
		const floor = Math.floor(average)
		let halfStarPosition = null
		if (average > floor) { halfStarPosition = floor + 1 }
		console.log(totalScore, average, halfStarPosition)
		return ( 
			<div className='ratings-menu-column'>
				<div className='ratings-bar'>
				{	[1,2,3,4,5].map(star => {
						return (
							<div className='star-icon-container'>
								<img src={(star === halfStarPosition) ? `/assets/icons/half-star.svg` : (star <= floor) ? `/assets/icons/star-full.svg` : `/assets/icons/star-empty.svg`} />
							</div>
						)
					})
				}
				</div>
				<div 
					className='ratings-modal-link'
					onClick={() => this.props.showModal('VIEW_REVIEWS_MODAL', {reviewArray: reviews, arrayType: 'Reviews'})}
				> 
					See Reviews 
				</div>
			</div>
		)
	}

	generateItemDOM = () => {
		const { isAuthenticated, marketplaceItems, wishlist } = this.props

		return marketplaceItems.map(item => {
			return(
				<div className="ui_card_mockup">
					<div className='ui_card_image'>
						<img className='card-image-source' src={item.imageURL} />
						<div className='card-image__hoverover'>
							{ (item.description) && <p style={{textAlign: 'center', padding: '5px 5px', margin: 0}} > {item.description} </p> }
							{ (item.reviews) && this.generateReviewHoveroverContainer(item.reviews) }

						</div>
					</div>
					<div className='ui_card_content'>
						<div className='ui-card-infotext'>
							<div className='item-header-container' >
								<h3 className="StoreItem-Header-Name"> {item.itemName} </h3>
								<div className={this.handleWishlistIcon(item._id)} 
									onClick={(isAuthenticated) ? () => this.handleWishlistClick(item._id) : () => {}} >
										<div className='wishlist-icon-message'> Add to Wishlist </div>
										<img src='./assets/icons/gift.svg' />
								</div>
							</div>
							<p className="store-link" onClick={() => this.props.routeToNode(`/essos/user/${item.sellerRef_id}`)}> Posted By: {item.postedBy} </p>
							{ (item.followers.length > 0) &&  
								<p 
									className='item-wishlist-counter'
									onClick={() => this.props.showModal('VIEW_USER_SOCIAL_DETAILS', {userArray: item.followers, arrayUserType: 'Wishlisted'})}
								> 
									<span> {item.followers.length} </span> user{item.followers.length > 1 && 's'} want{item.followers.length < 2 && 's'} this item. 
								</p> }
							<p className="store-pricing"> ${item.itemPrice} </p>
						</div>
						<div className="cart-button button_no_border_radius" onClick={() => this.props.showModal('CONFIRM_CART_ADDITION', {item: item})} ><span> Add To Cart Icon </span> </div>
					</div>
				</div>
			)
		})
	}

	generateShoppingCartDropdownContent = () => {
		const { shoppingCart } = this.props
		console.log("attempting to map those pesky shopping cart items")
		console.log(shoppingCart)
		console.log(shoppingCart.itemsBought)
		return shoppingCart.itemsBought.map(item => {
			return(
				<div className='cart-item-container-row'>
					<div className='cart-item-mini-image-container'>
						<img className='cart-item-mini-image' src={item.imageURL} />
					</div>
					<div className='cart-item-descriptor-container'>
						<div className='cart-item-name-container'>
							{item.itemName}
						</div>
						<div className='cart-item-quant-container'>
							{`Quantity Requested: ${item.numberRequested}`}
						</div>
						<div className='cart-item-price-container' >
							{`Cost Per Unit: $${item.itemPrice}`}
						</div>
					</div>
				</div>
			)
		})		
	}

	render() {
		const { marketplaceItems, shoppingCart } = this.props
		
		return(
			<div className='app-root'>  

			<ModalRoot />
	        
	          <header className='app-header'>
	              <div className='logo-container'>
	              </div>
	              <div className='account-control'>
	              	<div className='my-notifications-button'>
	              		<img style={{marginTop:5}} src='./assets/icons/notification.svg' />
	              	</div>
	             	<div className='my-cart-button'>
	              		<img className='my-cart-icon' src='./assets/icons/my-cart.svg' />
	              		<div className='my-cart-dropdown'>
	              			<div className='shopping-cart-dropdown-container'>
								{ shoppingCart && this.generateShoppingCartDropdownContent() }
								<button onClick={() => this.props.routeToNode('/essos/mycart')}> Check Out </button>
							</div>
							<div className='shopping-cart-dropdown-pricing-container' >
							</div>
	              		</div>
	              	</div>

	              	<div onClick={() => this.props.routeToNode('/essos/profile/')}className='my-store-button'>
	              		<img className='my-store-icon' src='./assets/icons/online-store.svg' />
	              		<span> My Shop </span>
	              	</div>
	              </div>
	          </header>
	          
	          <div className='jumbotron'>
	            <img className='jumbotron-greeter' src='./assets/store-splash/greeting4.jpg' />
	            <div className={`hatcontainer1 jumbotron-context-box`}>
	            	<div className='hatcontainer1__notif'> 
	            		<h6> Add to Cart </h6>
	            	</div>
	            	<div className='hat1-bullseye' />
	            </div>
	           	<div className='hatcontainer-1-companion context-container'>
	            	<h6> Custom Fitted </h6>
	            	<p style={{color: 'green'}}> 50$ </p>
	            	<button> See Details </button>
	            	{ /* <div className='hatContainer1-clickerOverlayHelper' onMouseEnter={() => this.setState({ activeJumbo: 'hat1'})} onMouseLeave={() => this.setState({ activeJumbo: null})} /> */ }
	            </div>

	            <div className='teecontainer1 jumbotron-context-box' >
	            	<div className='hatcontainer1__notif'> 
	            	<h6> Add to Cart </h6>
	           		</div>

	            </div>
	            <div className='pantscontainer2 jumbotron-context-box' />
	            <div className='acccontainer1 jumbotron-context-box' />
	            <div className='acccontainer2 jumbotron-context-box' />
	            <div className='acccontainer3 jumbotron-context-box' />
	            <div className='pantscontainer1 jumbotron-context-box' />
	            <button className='greeter-button' >
	                V See All Items V
	            </button>
	          </div>
	         
	          <section className='featured-items'>
	            <div className='featured-items__header-container' >
	            <h1> Featured Products </h1>
	            </div>
	            <div className='featured-items__slider-container' >
	               <img className='featured-mockup' src='./assets/store-splash/featured-1.jpg'/> 
	               <img className='featured-mockup' src='./assets/store-splash/featured-2-2.jpg'/> 
	               <img className='featured-mockup' src='./assets/store-splash/featured-3.jpg'/> 
	               <img className='featured-mockup' src='./assets/store-splash/featured-4.jpg'/> 
	            </div>
	          </section>

	          <div className='search-bar-container'>
	          </div>
	          <div className='main-items-container'>
	          	{ marketplaceItems && this.generateItemDOM()}
	          </div>
	      </div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EssosMarket)