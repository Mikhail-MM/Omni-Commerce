import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../styles/UserPage.css'

import ModalRoot from '../ModalRoot'

import UserItemScreen from './UserItemScreen'
import ShipmentOrderScreen from './ShipmentOrderScreen'
import PurchaseHistoryScreen from './PurchaseHistoryScreen'

import { followUser } from '../../actions/social'
import { showModal } from '../../actions/modals'

const UserPageComponentMap = {
	'USER_MARKET_ITEMS': UserItemScreen,
	'SHIPMENT_REQUESTS': ShipmentOrderScreen,
	'PURCHASE_HISTORY': PurchaseHistoryScreen,
}

const mapStateToProps = state => {
	const { followContacts } = state.socialReducer
	const { token, isAuthenticated } = state.authReducer
	return { followContacts, token, isAuthenticated }

}

const mapDispatchToProps = dispatch => ({
	showModal: (modalType, modalRoot) => dispatch(showModal(modalType, modalRoot)),
	followUser: (token, userId, mode) => dispatch(followUser(token, userId, mode)),
})

class UserPage extends Component {
	state = {
		indexActive: null,
		loading: true,
		userFullName: '',
		userAvatarURL: '',
		followers: [],
		following: [],
		wistlist: [],
		itemsPostedLength: 0,
		componentView: 'USER_MARKET_ITEMS',
		fullData: {}
	}

	setItemsLengthAfterLoading = (length) => {
		this.setState({
			itemsPostedLength: length
		})
	}

	fetchProfilePageMetadata = (userID) => {
		const { token } = this.props
		if (!this.props.selfProfileView) return fetch(`/users/essos/getProfileView/${this.props.match.params.id}`, {
				headers:{
					'Content-Type': 'application/json',
				},
				method: 'GET',
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => {
				console.log("found metadata:", json)
				return json
			})
			.catch(err => console.log(err))
		if (this.props.selfProfileView) return fetch(`/users/essos/getProfileView/ownProfile`, {
			headers:{
					'Content-Type': 'application/json',
					'x-access-token': token,
					'x-user-pathway': 'Essos',
				},
				method: 'GET',
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => {
				console.log("found metadata:", json)
				return json
			})
			.catch(err => console.log(err))

	}

	handleFollowRequest = () => {
		const { followContacts, token, isAuthenticated } = this.props
		if (!isAuthenticated) return console.log("not logged in")
		if (followContacts.find(user => user.userId == this.props.match.params.id)) {
			return this.props.followUser(token, this.props.match.params.id, 'unfollow')
		} else {
			return this.props.followUser(token, this.props.match.params.id, 'follow')
		}

	}


	async componentDidMount() {
		window.scrollTo(0, 0)

		const profileData = await this.fetchProfilePageMetadata()
		const { firstName, lastName, avatarURL, followers, following, wishlist, _id } = profileData

		if (profileData) return this.setState({
			userFullName: `${firstName} ${lastName}`,
			userAvatarURL: avatarURL,
			followers,
			following,
			wishlist,
			loading: false,
			selfID: _id,
			fullData: profileData,
		})
	}


	render() {

		const UserDetailDisplayComponent = UserPageComponentMap[this.state.componentView]
		const { followContacts } = this.props

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
									{ (this.props.selfProfileView) ? (
										<div 
											className='user-avatar-hoverover'
											onClick={() => this.props.showModal('MODIFY_ESSOS_PROFILE_SETTINGS', {profileData: this.state.fullData})}
										>
											Profile Settings
										</div>
									   ) : (null) }
									<img className='user-avatar-image' src={this.state.userAvatarURL} />
								</div>
								<div className='user-name-blurb' >
									{this.state.userFullName}
								</div>

								<div className='user-social-stats' >
									<div className='userpage-ticker-container' 
										onClick={() => this.props.showModal('VIEW_USER_SOCIAL_DETAILS', {userArray: this.state.followers, arrayUserType: 'Followers'})}
									>
										<div className='ticker-header'> Followers </div>
										<div className='ticker-payload'> {this.state.followers.length} </div>
									</div>
									<div className='userpage-ticker-container'
										onClick={() => this.props.showModal('VIEW_USER_SOCIAL_DETAILS', {userArray: this.state.following, arrayUserType: 'Following'})}
									>
										<div className='ticker-header'> Following </div>
										<div className='ticker-payload'> {this.state.following.length} </div>
									</div>
									<div className='userpage-ticker-container'
										onClick={() => this.props.showModal('VIEW_USER_WISHLIST', {wishlistArray: this.state.wishlist, arrayType: 'Wishlist'})}
									>
										<div className='ticker-header'> Wishlist </div>
										<div className='ticker-payload'> {this.state.wishlist.length} </div>
									</div>
									<div className='userpage-ticker-container'>
										<div className='ticker-header'> Items </div>
										<div className='ticker-payload'> {this.state.itemsPostedLength} </div>
									</div>
								</div>
							</div>
					   )
					}
					<div className='user-menu-control-panel'>
						{ (this.props.selfProfileView) ? (
							<div className='user-context-menu-button-container'>
								<div 
									className='user-menu-category-button-container'
									onClick={() => this.setState({indexActive: 0, componentView: 'USER_MARKET_ITEMS'})}
								>
									<div> My Items </div>
									<div className={`user-menu-category-button-icon-container ${(this.state.componentView === 'USER_MARKET_ITEMS') ? ' active-button-icon-container' : ''}`}>
										<img src={'/assets/icons/upb1.svg'} />
									</div>
								</div>
								<div 
									className='user-menu-category-button-container'
									onClick={() => this.setState({indexActive: 1, componentView: 'SHIPMENT_REQUESTS'})}
								>
									<div> My Sales </div>
									<div className={`user-menu-category-button-icon-container ${(this.state.componentView === 'SHIPMENT_REQUESTS') ? ' active-button-icon-container' : ''}`}>
										<img src={'/assets/icons/upb2.svg'} />
									</div>
								</div>
								<div 
									className='user-menu-category-button-container'
									onClick={() => this.setState({indexActive: 2, componentView: 'PURCHASE_HISTORY'})}
								>
									<div> My Purchases </div>
									<div className={`user-menu-category-button-icon-container ${(this.state.componentView === 'PURCHASE_HISTORY') ? ' active-button-icon-container' : ''}`}>
										<img src={'/assets/icons/upb3.svg'} />
									</div>
								</div>
								<div 
									className='user-menu-category-button-container'
									onClick={() => this.setState({indexActive: 3, componentView: 'PURCHASE_HISTORY'})}
								>
									<div> Add Item </div>
									<div className='user-menu-category-button-icon-container' onClick={() => {
										this.setState({indexActive:3})
										this.props.showModal('DATABASE_INTERFACE_MODAL', {module: 'Essos', action: 'upload' })
										}
									} >
										<img src={'/assets/icons/upb4.svg'} />
									</div>
								</div>
							</div>							
						   ) : (
						   	<div className='user-menu-control-panel'>
						   		<button onClick={() => this.handleFollowRequest()}> {(followContacts.find(user => user.userId == this.props.match.params.id)) ? 'UnFollow' : 'Follow' } </button>
						   	</div>
						   )

						}
					</div>
				</div>
				{ (this.state.loading) ? (<div> Loading ... </div>) : (<UserDetailDisplayComponent {...this.props} selfProfileID={this.state.selfID} setItemsLength={this.setItemsLengthAfterLoading}/>) }
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)