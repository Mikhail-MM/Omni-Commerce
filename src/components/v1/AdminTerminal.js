import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { Menu, Image, Icon } from 'semantic-ui-react'

import avatar from '../assets/image-1.png'

import EmployeeManagement from './EmployeeManagement'

function mapStateToProps(state) {
		const { isAuthenticated } = state.authReducer
		return { isAuthenticated }
}

class AdminTerminal extends Component {
	constructor(props) {
		super(props)
	}

	navigateToDisplay(route) {
		const { dispatch, match } = this.props
		dispatch(push(`${match.url}/${route}`))
	}

	render() {

		const { isAuthenticated, match } = this.props;
		console.log(isAuthenticated)
		return(
		
		<div className="admin-page-wrapper" >
			{ !isAuthenticated && <Redirect to='/login' />}
			
			<div className="admin-header" >
				<Menu pointing secondary fluid selectable>
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
					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'home')}>
						<Icon name="home" />
						Home
					</Menu.Item>

					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'inbox')}>
						<Icon name="inbox" />
						Inbox
					</Menu.Item>
					
					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'calendar')}>
						<Icon name="calendar" />
						Events/Scheduling
					</Menu.Item>
					
					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'employees')}>
						<Icon name="users" />
						Manage Employees
					</Menu.Item> 

					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'add_new_user')}>
						<Icon name='add user' />
						Invite New User
					</Menu.Item>

					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'billing_and_invoices')}>
						<Icon name='calculator' />
						Billing & Invoices
					</Menu.Item>

					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'transactions')}>
						<Icon name="cubes" />
						See All Transactions
					</Menu.Item>

					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'timesheets')}>
						<Icon name='file text outline' />
						Manage Time Sheets
					</Menu.Item>

					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'add_item')}>
						<Icon name='barcode' />
						Add Item To Terminal
					</Menu.Item>

					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'open_ticket')}>
						<Icon name='add square' />
						Open New Ticket
					</Menu.Item>
					
					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'payments')}>
						<Icon name='stripe' />
						Payment Processing
					</Menu.Item>

					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'sales_reports')}>
						<Icon name='bar graph' />
						Analytics & Sales Reporting
					</Menu.Item>

					<Menu.Item onClick={this.navigateToDisplay.bind(this, 'build_announcement')}>
						<Icon name='warning sign' />
						Broadcast Announcement
					</Menu.Item>

					<Menu.Item className='admin-menu_bottom-button' onClick={this.navigateToDisplay.bind(this, 'send_feedback')}>
						<Icon name='help circle' />
						Help and Feedback
					</Menu.Item>
				</Menu>
			</div>
			<div className="admin-content-display">
				<div className="admin-content-display_inner-wrapper">
					<Switch>
						<Route path={`${match.url}/home`} render={() => <div>Home</div>} />
						<Route path={`${match.url}/inbox`} render={() => <div>Messages</div>} />
						<Route path={`${match.url}/calendar`} render={() => <div>Calendar</div>} />
						<Route path={`${match.url}/employees`} component={EmployeeManagement} />
						<Route path={`${match.url}/add_new_user`} render={() => <div>Add New User</div>} />
						<Route path={`${match.url}/billing_and_invoices`} render={() => <div>Billing & Invoices</div>} />
						<Route path={`${match.url}/transactions`} render={() => <div>See All Current Transactions</div>} />
						<Route path={`${match.url}/timesheets`} render={() => <div>Manage Timesheets</div>} />
						<Route path={`${match.url}/add_item`} render={() => <div>Add Item modal</div>} />
						<Route path={`${match.url}/open_ticket`} render={() => <div>Open New Ticket</div>} />
						<Route path={`${match.url}/payments`} render={() => <div> Payment Processing</div>} />
						<Route path={`${match.url}/sales_reports`} render={() => <div>Analytics</div>} />
						<Route path={`${match.url}/build_announcement`} render={() => <div>Announcement! LOUD!</div>} />
						<Route path={`${match.url}/send_feedback`} render={() => <div>Help/Feedback Form</div>} />
					</Switch>
				</div>
			</div>
			</div>
		</div>
		)
	}
}

export default withRouter(connect(mapStateToProps)(AdminTerminal))