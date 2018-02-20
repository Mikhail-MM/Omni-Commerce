import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Icon, Button, Image } from 'semantic-ui-react'

import { retrieveItemsFromMarketplace } from '../actions/marketplaces'

import blouseImage from '../assets/marketBlouse.jpg'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { currentMarketplace } = state.marketplaceBrowserReducer
	const { marketplaceItems } = state.marketplaceItemsReducer
	return { token, currentMarketplace, marketplaceItems }
}

class OnlineStoreMarketplaceSpecificItemBrowser extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	
	renderMarketplaceItems() {
		// Placeholder function to mock styling for real data to be retrieved from API
		const { marketplaceItems } = this.props
		

		return marketplaceItems.map(item => {
			return (<div className='cardContainer'>
						<Card>
							<Image src={blouseImage} />
							<Card.Content>
								<Card.Header> {item.itemName} </Card.Header>
								<Card.Meta> In-Stock: 5 </Card.Meta>
								<Card.Description> A classy top that is sure to turn heads! </Card.Description>
								<Card.Header> $ 16.99 </Card.Header>
							</Card.Content>
							<Card.Content extra>
								<Button color='black' onClick={this.confirmOrder.bind(this, item._id)}> <Icon name='add to cart' /> Add To Cart </Button>
							</Card.Content>
						</Card>
					</div>
					)

		})
	}

	render() {
		const { marketplaceItems } = this.props
		return(
			<div> {marketplaceItems && this.renderMarketplaceItems()} </div>
		)
	}
}

export default connect(mapStateToProps)(OnlineStoreMarketplaceSpecificItemBrowser)