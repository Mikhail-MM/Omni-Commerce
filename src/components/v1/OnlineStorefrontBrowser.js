import React, { Component } from 'react'
import { connect } from 'react-redux'

import marketImage from '../assets/market-icons.jpg'

import { Item, Button, Icon } from 'semantic-ui-react'

import { retrieveAllMarketplaces, retrieveMarketplaceById, retrieveItemsFromMarketplace, navigateToMarketplaceAndGrabItems } from '../actions/marketplaces'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { allMarketplaces, currentMarketplace, marketplaceItems } = state.marketplaceBrowserReducer
	return { token, allMarketplaces, currentMarketplace, marketplaceItems }
}



class OnlineStorefrontBrowser extends Component {
	constructor(props) {
		super(props)
		this.renderMarketplaces = this.renderMarketplaces.bind(this)
	}
	componentDidMount() {
		const { dispatch } = this.props
		dispatch(retrieveAllMarketplaces())	
	}

	renderMarketplaces() {
		const { allMarketplaces } = this.props 
		return allMarketplaces.map(marketplace => {
			return(
				<div className="marketplace-wrapper">
					<div className="marketplace-avatar-container">
						<img src={marketplace.imageURL} />
					</div>
					<div className="marketplace-card-content">
						<h3> {marketplace.storeName} </h3>
						<p> Catchy description here! </p>
						<Button onClick={this.bringMarketplaceIntoFocus.bind(this, marketplace._id)}> Visit! </Button>
					</div>
				</div>
			)
		});
	}
	
	bringMarketplaceIntoFocus(marketplaceId) {

		const { dispatch, changeVisibility } = this.props

		dispatch(navigateToMarketplaceAndGrabItems(marketplaceId))

		changeVisibility("StoreItems")

	}

	render() {
		const { allMarketplaces } = this.props
		return(
			<div className="storeItemContainer">
			{allMarketplaces && this.renderMarketplaces()}
			</div>
		)
	}
}

export default connect(mapStateToProps)(OnlineStorefrontBrowser)