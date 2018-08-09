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
						<h3 className="StoreItem-Header-Name"> {item.itemName} </h3>
						<p className="store-link" onClick={() => this.props.routeToMarketPlace(`/essos/user/${item.sellerRef_id}`)}> Posted By: {item.postedBy} </p>
						<p className="store-pricing"> ${item.itemPrice} </p>
						<button className="button_no_border_radius" ><span> Add To Cart Icon </span> </button>
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