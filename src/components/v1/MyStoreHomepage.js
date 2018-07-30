import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button, Image, Icon, Item, Sidebar, Menu, Segment } from 'semantic-ui-react'


import ModalRoot from './ModalRoot'
import { showModal } from '../actions/modals'

import { retrieveAllMarketplaces, retrieveMarketplaceById } from '../actions/marketplaces'

import OnlineStoreGlobalItemBrowser from './OnlineStoreGlobalItemBrowser'
import OnlineStorefrontBrowser from './OnlineStorefrontBrowser'
import OnlineStoreMarketplaceSpecificItemBrowser from './OnlineStoreMarketplaceSpecificItemBrowser'
import ShoppingCartSidebar from './ShoppingCartSidebar'
import TagFilterSearch from './TagFilterSearch'
import ModifyMyStoreItemsScreen from './ModifyMyStoreItemsScreen'
import SearchItems from './SearchItems'

function mapStateToProps(state) {
	const { allMarketplaces, currentMarketplace } = state.marketplaceBrowserReducer
	const { marketplaceItems, currentMarketplaceItem } = state.marketplaceItemsReducer
	return { allMarketplaces, currentMarketplace, marketplaceItems, currentMarketplaceItem }
}
class MyStoreHomepage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			sidebarVisible: false,
			mainContentVisible: 'AllMarketplaces'
		}
		this.toggleSidebar = this.toggleSidebar.bind(this)
		this.dispatchMarketplaceItemAddModal = this.dispatchMarketplaceItemAddModal.bind(this)
		this.setContentVisible = this.setContentVisible.bind(this)
	}

	

	setContentVisible(contentType) {
		this.setState({
			mainContentVisible: contentType
		})
	}

	toggleSidebar() {
		this.setState({sidebarVisible: !this.state.sidebarVisible})
	}

	dispatchMarketplaceItemAddModal() {
		const { dispatch } = this.props
		dispatch(showModal('ADD_MARKETPLACE_ITEM', {}))
	}

	render() {
		const { marketplaceItems } = this.props
		return(
			<Sidebar.Pushable>
			<ModalRoot/>
			<Sidebar className="shopping-cart-sidebar-wrapper" as={Menu} direction='right' animation='overlay' width='very wide' visible={this.state.sidebarVisible} icon='labeled' inverted>
				<ShoppingCartSidebar />
			</Sidebar>
			
			<Sidebar.Pusher>
			<div className='my-store-page-wrapper' >
				<div className='my-store-sidebar-left'>
					<div className='my-store-left-sidebar_button' >
						<Icon className='my-store-left-sidebar_button_icon' name='home' size='huge'/>
						<h5 className='my-store-left-sidebar_button_heading'> Home </h5>
					</div>
					<div className='my-store-left-sidebar_button' >
						<Icon className='my-store-left-sidebar_button_icon' name='mail' size='huge'/>
						<h5 className='my-store-left-sidebar_button_heading'> Messages </h5>					
					</div>

					<div className='my-store-left-sidebar_button my-store-left-sidebar_bottom-button' onClick={this.toggleSidebar}>
						<Icon className='my-store-left-sidebar_button_icon _last_icon' name='shopping cart' size='huge'/>
						<h5 className='my-store-left-sidebar_button_heading'> My Cart </h5>					
					</div>
					<div className='my-store-left-sidebar_button' onClick={() => this.setContentVisible("ModifyMyItems")} >
						<Icon className='my-store-left-sidebar_button_icon' name='cube' size='huge'/>
						<h5 className='my-store-left-sidebar_button_heading'> Manage Stock </h5>					
					</div>
					<div className='my-store-left-sidebar_button' >
						<Icon className='my-store-left-sidebar_button_icon' name='file text outline' size='huge'/>
						<h5 className='my-store-left-sidebar_button_heading'> Purchase Orders </h5>					
					</div>
					<div className='my-store-left-sidebar_button my-store-left-sidebar_bottom-button' >
						<Icon className='my-store-left-sidebar_button_icon _last_icon' name='credit card alternative' size='huge'/>
						<h5 className='my-store-left-sidebar_button_heading'> Payments </h5>					
					</div>

				</div> 
				<div className='my-store-homepage-main-content' >
					<SearchItems/>
					<div className='my-store-main-content-border'>

				
						{ this.state.mainContentVisible === "AllItems" && <OnlineStoreGlobalItemBrowser /> }
	
						{ this.state.mainContentVisible === "AllMarketplaces" && <OnlineStorefrontBrowser changeVisibility={this.setContentVisible} /> }

						{ this.state.mainContentVisible === "StoreItems" && <OnlineStoreMarketplaceSpecificItemBrowser /> }

						{ this.state.mainContentVisible === "ModifyMyItems" && <ModifyMyStoreItemsScreen />}

					</div>


				</div>
				<div className='my-store-homepage-right-sidebar'>
					<div className='store-modern-menu'>
						<h5>FallJ124's Marketplace</h5>
					</div>
					<div className='store-and-user-avatar' >
						<section className='user-avatar' >

						</section>
						<section className='store avatar' >

						</section>
					</div>
					<div className='shop-stats-container' >
						<h5>Store Stats</h5>
						<Button color="black" fluid onClick={() => this.setContentVisible("AllMarketplaces")}> Browse All Marketplaces </Button>
						<Button color="black" fluid onClick={() => this.setContentVisible("AllItems")}> Browse All Items </Button>
						<Button color="black" fluid onClick={this.dispatchMarketplaceItemAddModal}> Add Item To My Marketplace </Button>
						<div className='itemFilterFormWrapper'>
							{ marketplaceItems && <TagFilterSearch /> }
						</div>
					</div>
					<div className='bottom-menu' >
					</div>
				</div>
			</div>
			</Sidebar.Pusher>
			</Sidebar.Pushable>

		)
	}
}

export default connect(mapStateToProps)(MyStoreHomepage)