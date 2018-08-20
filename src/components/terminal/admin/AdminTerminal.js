import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../../styles/AdminTerminal.css'

import { showModal } from '../../../actions/modals'

import { getAllEvents } from '../../../actions/events'
import { subscribeToFeedUpdates, closeConnection } from '../../../actions/socket'

import EmployeeManagement from './EmployeeManagement'
import SalesAnalytics from './SalesAnalytics'
import TimeSheetTable from './TimeSheetTable'

const mapStateToProps = state => {

	const { token } = state.authReducer
	return { token }

}

const mapDispatchToProps = dispatch => ({

	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),

})

const AdminComponentMap = {
	'MANAGE_EMPLOYEES': EmployeeManagement,
	'MANAGE_SALES_REPORTS': SalesAnalytics,
	'MANAGE_TIMESHEETS': TimeSheetTable,
}

class AdminTerminal extends Component {
	state = {
		actionComponent: 'MANAGE_EMPLOYEES',
		eventFeed: [],
	}
	
	async componentDidMount() {
		const { token } = this.props
		const feed = await getAllEvents(token)
		
		this.setState({
			eventFeed: feed
		})

		subscribeToFeedUpdates(this.updateEventFeed)
	}

	componentDidUnmount() {
		closeConnection()
	}

	updateEventFeed = (newEvent) => {
		const { eventFeed } = this.state
		const updatedFeed = [...eventFeed, newEvent]
		this.setState({
			eventFeed: updatedFeed
		})
	}

	render() {
		const AdminActionDisplayComponent = AdminComponentMap[this.state.actionComponent]

		return(
			<div className='admin-page-wrapper'>
				<div className='app-header-admin'>
				</div>
				<div className='main-body-wrapper' >
					<div className='sidebar-column'>
						<div className='menu-box'>
							<div className='admin-button' onClick={() => this.setState({actionComponent: 'MANAGE_EMPLOYEES'})}>
								<img className='admin-menu-icon' src='./assets/icons/emp_mng.svg' />
								<span> Employees </span>
							</div>
							<div className='admin-button' onClick={() => this.setState({actionComponent: 'MANAGE_SALES_REPORTS'})}>
								<img className='admin-menu-icon' src='./assets/icons/analytics.svg' />
								<span> Sales Reports </span>
							</div>
							<div className='admin-button' onClick={() => this.setState({actionComponent: 'MANAGE_TIMESHEETS'})}>
								<img className='admin-menu-icon' src='./assets/icons/calendar.svg' />
								<span> Timesheets </span>
							</div>					
						</div>
						<div className="menu-box__bottom">
							<div className='admin-button'>
								<img className='admin-menu-icon' src='./assets/icons/cash-register.svg' />
								<span> Access Terminal </span>
							</div>
							<div className='admin-button'>
								<img className='admin-menu-icon' src='./assets/icons/logout.svg' />
								<span> Log Out </span>
							</div>		
						</div>
					</div>

					<AdminActionDisplayComponent />

					<div className='feed-column'>

					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminTerminal)