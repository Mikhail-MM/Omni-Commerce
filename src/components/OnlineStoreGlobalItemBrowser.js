import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, Image, Button, Icon } from 'semantic-ui-react'

import { retrieveAllItemsForSale, retrieveItemById, pushItemIntoShoppingCart } from '../actions/marketplaces'
import { showModal } from '../actions/modals'

import blouseImage from '../assets/marketBlouse.jpg'

import CartInvalidationAlert from './CartInvalidationAlert'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { marketplaceItems, currentMarketplaceItem } = state.marketplaceItemsReducer
	
 
	return { token, marketplaceItems, currentMarketplaceItem }
}

class OnlineStoreGlobalItemBrowser extends Component {
	constructor(props) {
		super(props)
		this.renderMarketplaceItems = this.renderMarketplaceItems.bind(this)
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(retrieveAllItemsForSale())
	}


	renderMarketplaceItems() {
		// Placeholder function to mock styling for real data to be retrieved from API
		const { marketplaceItems } = this.props
		return marketplaceItems.map(item => {
			return (<div className='cardContainer'>
						<Card >
							<Image src={blouseImage} />
							<Card.Content>
								<Card.Header> {item.itemName} </Card.Header>
								<Card.Meta> In-Stock: { item.numberInStock } </Card.Meta>
								<Card.Description> A classy top that is sure to turn heads! </Card.Description>
								<Card.Header> $ 16.99 </Card.Header>
							</Card.Content>
							<Card.Content extra>
								<Button color='black' onClick={this.confirmOrder.bind(this, item._id)} disabled={item.numberInStock === 0}> <Icon name='add to cart' /> Add To Cart </Button>
							</Card.Content>
						</Card>
					</div>
					)

		})
	}

	/*
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
	*/



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
			<h3> All Items </h3>
			{ marketplaceItems && this.renderMarketplaceItems() }
			</div>

		)
	}
}

export default connect(mapStateToProps)(OnlineStoreGlobalItemBrowser)