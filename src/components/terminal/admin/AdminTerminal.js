import React, { Component } from 'react'
import '../../styles/AdminTerminal.css'

class AdminTerminal extends Component {
	render() {
		return(
			<div className='admin-page-wrapper'>
				<div className='sidebar-column'>
					<div className='menu-box'>
						<div className='admin-button'>
							Access Point-Of-Sale
						</div>
						<div className='admin-button'>
							Manage Employees
						</div>
						<div className='admin-button'>
							View Statistics
						</div>					
					</div>
				</div>
				<div className='action-column'>
				</div>
				<div className='feed-column'>
				</div>
			</div>
		)
	}
}

export default AdminTerminal