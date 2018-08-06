import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../styles/UserPage.css'

const mapStateToProps = (state, ownprops) => {
	const { marketplaceItems } = state.marketplaceItemsReducer
	console.log("Listing OwnProps in MapState of UserPage: ", ownprops)
	return {
		sellerItems: filterItemsBySeller(marketplaceItems, ownprops.params.id)
	}
}


const filterItemsBySeller = (items, sellerID) => {
	return items.filter(item => item.)
}
class UserPage extends Component {
	state = {
		userAvatarURL: ''
	}

	render() {
		return (
			<div className='user-page-wrapper'>
				<div className='main-user-header'>
				</div>
				<div className='user-content-wrapper'>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps)(UserPage)