import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../styles/UserPage.css'

import UserItemScreen from './UserItemScreen'
import ShipmentOrderScreen from './ShipmentOrderScreen'
import PurchaseHistoryScreen from './PurchaseHistoryScreen'

const UserPageComponentMap = {
	'USER_MARKET_ITEMS': UserItemScreen,
	'SHIPMENT_REQUESTS': ShipmentOrderScreen,
	'PURCHASE_HISTORY': PurchaseHistoryScreen,
}

class UserPage extends Component {
	state = {
		loading: true,
		userFullName: '',
		userAvatarURL: '',
		componentView: 'USER_MARKET_ITEMS',
	}

	fetchProfilePageMetadata = (userID) => {
		if (!this.props.selfProfileView) return fetch(`http://localhost:3001/users/essos/getProfileView/${this.props.match.params.id}`, {
				headers:{
					'Content-Type': 'application/json',
				},
				method: 'GET',
				mode: 'cors'
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => {
				console.log("found metadata:", json)
				return json
			})
			.catch(err => console.log(err))
		if (this.props.selfProfileView) return null
	}


	async componentDidMount() {
		window.scrollTo(0, 0)

		const profileData = await this.fetchProfilePageMetadata()
		const { firstName, lastName, avatarURL } = profileData

		if (profileData) return this.setState({
			userFullName: `${firstName} ${lastName}`,
			userAvatarURL: avatarURL,
			loading: false,
		})
	}


	
	render() {

		const UserDetailDisplayComponent = UserPageComponentMap[this.state.componentView]

		return (
			<div className='user-page-wrapper'>
				<div className='main-user-header'>
					{ (this.state.loading === true) ? (
						<div className='user-social-container' >
							<div className='user-avatar metadata-loading'/>
							<div className='user-name-blurb metadata-loading' />
							<div className='user-social-stats metadata-loading' />
						</div>
					   ) : (
							<div className='user-social-container' >
								<div className='user-avatar'>
									<img className='user-avatar-image' src={this.state.userAvatarURL} />
								</div>
								<div className='user-name-blurb' >
									{this.state.userFullName}
								</div>

								<div className='user-social-stats' >
									{`Some Stats...`}
								</div>
							</div>
					   )
					}
					<div className='user-menu-control-panel'>
						{ (this.props.selfProfileView) ? (
							<button onClick={() => this.setState({componentView: 'USER_MARKET_ITEMS'})}> Modify My Items </button>
							<button onClick={() => this.setState({componentView: 'SHIPMENT_REQUESTS'})}> Shipment Orders </button>
							<button onClick={() => this.setState({componentView: 'PURCHASE_HISTORY'})}> My Purchase History </button>
							
						   ) : (

						   )

						}
					</div>
				</div>
				{ <UserDetailDisplayComponent /> }
			</div>
		)
	}
}

export default UserPage