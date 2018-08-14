import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../../styles/AdminTerminal.css'

import { showModal } from '../../../actions/modals'

import EmployeeManagement from './EmployeeManagement'
import SalesAnalytics from './SalesAnalytics'

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
}

class AdminTerminal extends Component {
	state = {
		actionComponent: 'MANAGE_EMPLOYEES',
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
							<div className='admin-button'>
								<img className='admin-menu-icon' src='./assets/icons/emp_mng.svg' />
								<span> Employees </span>
							</div>
							<div className='admin-button'>
								<img className='admin-menu-icon' src='./assets/icons/analytics.svg' />
								<span> Sales Reports </span>
							</div>
							<div className='admin-button'>
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