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
		const styles = {backgroundColor: '#eee', display: 'flex', flexDirection: 'row', maxWidth: '100%', marginBottom: '30px'}	
			return(
				<Item style={styles} key={ marketplace._id }>
					<Item.Image size='medium' src={marketImage} />

					<Item.Content>
							<Item.Header> {marketplace.storeName} </Item.Header>
							<Item.Meta> Apparel Salesman </Item.Meta>
							<Item.Description> <Icon name=""/>We stock all sorts of...blouses!</Item.Description>
							<Item.Extra>
								<Button onClick={this.bringMarketplaceIntoFocus.bind(this, marketplace._id)}> Visit! </Button>
							</Item.Extra>
					</Item.Content>
				</Item>
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