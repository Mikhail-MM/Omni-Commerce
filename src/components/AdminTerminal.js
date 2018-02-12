import React, { Component } from 'react'

import { Menu, Image, Icon } from 'semantic-ui-react'

import avatar from '../assets/image-1.png'

class AdminTerminal extends Component {

	render() {
		return(
		<div className="admin-page-wrapper" >
			<div className="admin-header" >
				<Menu pointing secondary fluid>
					<Menu.Item className="admin-header-menu-item_first-item">
						<Image src={ avatar } avatar />
					</Menu.Item>
					<Menu.Item name='My Account' className='admin-header-menu-item_extra_padding_bottom'/>
					<Menu.Item className='admin-header-menu-item_extra_padding_bottom'>
						<Icon name='alarm'/>
						Notifications
					</Menu.Item>
					<Menu.Item name='Logout' position='right' className='admin-header-menu-item_extra_padding_bottom'/>
				</Menu>
			</div>
			<div className="admin-sidebar-and-content-wrapper" >
			<div className="admin-sidebar-menu" >
				<Menu inverted vertical fluid>
					<Menu.Item >
						<Icon name="home" />
						Home
					</Menu.Item>

					<Menu.Item>
						<Icon name="inbox" />
						Inbox
					</Menu.Item>
					
					<Menu.Item>
						<Icon name="calendar" />
						Events/Scheduling
					</Menu.Item>
					
					<Menu.Item>
						<Icon name="users" />
						Manage Employees
					</Menu.Item> 

					<Menu.Item>
						<Icon name='add user' />
						Invite New User
					</Menu.Item>

					<Menu.Item>
						<Icon name='calculator' />
						Billing & Invoices
					</Menu.Item>

					<Menu.Item>
						<Icon name="cubes" />
						See All Transactions
					</Menu.Item>
					<Menu.Item>
						<Icon name='file text outline' />
						Manage Time Sheets
					</Menu.Item>

					<Menu.Item>
						<Icon name='barcode' />
						Add Item To Terminal
					</Menu.Item>

					<Menu.Item>
						<Icon name='add square' />
						Open New Ticket
					</Menu.Item>
					<Menu.Item>
						<Icon name='stripe' />
						Payment Processing
					</Menu.Item>

					<Menu.Item>
						<Icon name='bar graph' />
						Analytics & Sales Reporting
					</Menu.Item>

					<Menu.Item>
						<Icon name='warning sign' />
						Broadcast Announcement
					</Menu.Item>

					<Menu.Item className='admin-menu_bottom-button'>
						<Icon name='help circle' />
						Help and Feedback
					</Menu.Item>
				</Menu>
			</div>
			<div className="admin-content-display">
			</div>
			</div>
			<div className="admin-footer">
			<Icon name='copyright' />
			Copyright Omni-Commerce 2018
			</div>
		</div>
		)
	}
}

export default AdminTerminal