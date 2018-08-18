import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../styles/UserPage.css'

import ModalRoot from '../ModalRoot'

import UserItemScreen from './UserItemScreen'
import ShipmentOrderScreen from './ShipmentOrderScreen'
import PurchaseHistoryScreen from './PurchaseHistoryScreen'

import { showModal } from '../../actions/modals'

const UserPageComponentMap = {
	'USER_MARKET_ITEMS': UserItemScreen,
	'SHIPMENT_REQUESTS': ShipmentOrderScreen,
	'PURCHASE_HISTORY': PurchaseHistoryScreen,
}

const mapStateToProps = state => {
	const { token } = state.authReducer
	return { token }

}

const mapDispatchToProps = dispatch => ({
	showModal: (modalType, modalRoot) => dispatch(showModal(modalType, modalRoot)),
})

class UserPage extends Component {
	state = {
		indexActive: null,
		loading: true,
		userFullName: '',
		userAvatarURL: '',
		componentView: 'USER_MARKET_ITEMS',
	}

	fetchProfilePageMetadata = (userID) => {
		const { token } = this.props
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
		if (this.props.selfProfileView) return fetch(`http://localhost:3001/users/essos/getProfileView/ownProfile`, {
			headers:{
					'Content-Type': 'application/json',
					'x-access-token': token,
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

	}


	async componentDidMount() {
		window.scrollTo(0, 0)

		const profileData = await this.fetchProfilePageMetadata()
		const { firstName, lastName, avatarURL, _id } = profileData

		if (profileData) return this.setState({
			userFullName: `${firstName} ${lastName}`,
			userAvatarURL: avatarURL,
			loading: false,
			selfID: _id,
		})
	}


	
	render() {

		const UserDetailDisplayComponent = UserPageComponentMap[this.state.componentView]

		return (
			<div className='user-page-wrapper'>
				<ModalRoot/>
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
							<div className='user-context-menu-button-container'>
								<div 
									className={(this.state.indexActive === 0 ) ? 'user-context-menu-button underlinebutton-active': 'user-context-menu-button'} 
									onClick={() => this.setState({indexActive: 0, componentView: 'USER_MARKET_ITEMS'})}
								>
									 My Items 
								</div>
								<div 
									className={(this.state.indexActive === 1 ) ? 'user-context-menu-button underlinebutton-active': 'user-context-menu-button'}  
									onClick={() => this.setState({indexActive: 1, componentView: 'SHIPMENT_REQUESTS'})}
								> 
									Orders 
								</div>
								<div 
									className={(this.state.indexActive === 2 ) ? 'user-context-menu-button underlinebutton-active': 'user-context-menu-button'}  
									onClick={() => this.setState({indexActive: 2, componentView: 'PURCHASE_HISTORY'})}
								> 
									Purchase History 
								</div>
								<div 
									className={(this.state.indexActive === 3 ) ? 'user-context-menu-button underlinebutton-active': 'user-context-menu-button'}  
									onClick={() => {
										this.setState({indexActive:3})
										this.props.showModal('DATABASE_INTERFACE_MODAL', {module: 'Essos', action: 'upload' })
										}
									}
								> 
									Add Item 
								</div>
							</div>
							
						   ) : (
						   	<div/>
						   )

						}
					</div>
				</div>
				{ (this.state.loading) ? (<div> Loading ... </div>) : (<UserDetailDisplayComponent {...this.props} selfProfileID={this.state.selfID}/>) }
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)