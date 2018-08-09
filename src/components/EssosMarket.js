import React, { Component } from 'react'
import { connect } from 'react-redux'
import './styles/EssosMarket.css';

import { retrieveAllItemsForSale, retrieveShoppingCart } from '../actions/marketplace'
import { routeToNode } from '../actions/routing'

const mapStateToProps = state => {
	const { token, isAuthenticated } = state.authReducer
	const { marketplaceItems } = state.marketplaceItemsReducer

	return { token, isAuthenticated, marketplaceItems }
}

const mapDispatchToProps = dispatch => ({
	retrieveAllMarketplaceItems: () => dispatch(retrieveAllItemsForSale()),
	retrieveShoppingCart: (token) => dispatch(retrieveShoppingCart(token)),
	routeToMarketPlace: (node) => dispatch(routeToNode(node)),
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
})

class EssosMarket extends Component {
	componentDidMount() {
		const { isAuthenticated, token } = this.props
		this.props.retrieveAllMarketplaceItems()
		if (isAuthenticated) this.props.retrieveShoppingCart(token)
	}

	generateItemDOM = () => {
		const { marketplaceItems } = this.props

		return marketplaceItems.map(item => {
			return(
				<div className="ui_card_mockup">
					<div className='ui_card_image'>
						<img src={item.imageURL} />
					</div>
					<div className='ui_card_content'>
						<div className='ui-card-infotext'>
							<h3 className="StoreItem-Header-Name"> {item.itemName} </h3>
							<p className="store-link" onClick={() => this.props.routeToMarketplace(`/essos/user/${item._sellerRef_id}`)}> Posted By: {item.postedBy} </p>
							<p className="store-pricing"> ${item.itemPrice} </p>
						</div>
						<div className="cart-button button_no_border_radius" onClick={() => this.props.showModal('CONFIRM_CART_ADDITION', {item: item})} ><span> Add To Cart Icon </span> </div>
					</div>
				</div>
			)
		})
	}

	render() {
		const { marketplaceItems } = this.props
		
		return(
			<div className='app-root'>  
	          <header className='app-header'>
	              <div className='logo-container'>
	              </div>
	              <div className='account-control'>
	             	<div className='my-cart-button'>
	              		<img className='my-cart-icon' src='./assets/icons/my-cart.svg' />
	              	</div>

	              	<div className='my-store-button'>
	              		<img className='my-store-icon' src='./assets/icons/online-store.svg' />
	              		<span> My Shop </span>
	              	</div>
	              </div>
	          </header>
	          
	          <container className='jumbotron'>
	            <img className='jumbotron-greeter' src='./assets/store-splash/greeting4.jpg' />
	            <button className='greeter-button' >
	                Shop Now
	            </button>
	          </container>
	         
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

	          <div className='storybook-container' >
	            <img className='feature-set-mockup' src='./assets/store-splash/dutone-3.jpg' />
	            <img className='feature-set-mockup' src='./assets/store-splash/dutone-2.jpg' />
	            <img className='feature-set-mockup' src='./assets/store-splash/dutone-1.jpg' />
	          </div>

	          <div className='search-bar-container'>
	          </div>
	          < div className='main-items-container' >
	          	{ marketplaceItems && this.generateItemDOM()}
	          </div>
	      </div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EssosMarket)