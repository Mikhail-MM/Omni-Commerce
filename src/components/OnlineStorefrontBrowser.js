import React, { Component } from 'react'
import { connect } from 'react-redux'

import { retrieveAllMarketplaces, retrieveMarketplaceById } from '../actions/marketplaces'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { allMarketplaces, currentMarketplace } = state.marketplaceBrowserReducer
	return { token, allMarketplaces, currentMarketplace }
}



class OnlineStorefrontBrowser extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
		this.generateMarketplacePortals = this.generateMarketplacePortals.bind(this)
	}
	componentDidMount() {
		const { dispatch } = this.props
		dispatch(retrieveAllMarketplaces())	
	}
	generateMarketplacePortals() {
		const { allMarketplaces } = this.props

		return allMarketplaces.map(marketplace => { 
			console.log("Mapping Marketplaces")
			return (
				<div 
					key={marketplace._id} 
					onClick={this.bringMarketplaceIntoFocus.bind(this, marketplace._id)}>
						{marketplace.storeName}
				</div>
			)
		})

	}
	bringMarketplaceIntoFocus(marketplaceId) {
		const { dispatch } = this.props
		dispatch(retrieveMarketplaceById(marketplaceId))
	}

	render() {
		const { allMarketplaces } = this.props
		return(
			<div>
			{allMarketplaces && this.generateMarketplacePortals()}
			</div>
		)
	}
}

export default connect(mapStateToProps)(OnlineStorefrontBrowser)