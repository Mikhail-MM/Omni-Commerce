import React, { Component } from 'react'
import '../../styles/AdminTerminal.css'

class AdminTerminal extends Component {
	state = {
		visibleCategory: 'employees',
		workerSearch: ''
	}

	handleChange = (key, value) => {
		this.setState({
			[key]: value
		})
	}

	render() {
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
					<div className='action-column'>
						<div className='employee-actions-bar'>
							<div className='add-employee-button'>
								<img className='admin-menu-icon' src='./assets/icons/add-user.svg' />
								Add Employee
							</div>
							<div className='admin-employee-search-bar-container'>
								<img className='admin-menu-icon' src='./assets/icons/worker.svg' />
								<input style={{flexGrow: 1}}type='text' value={this.state.workerSearch} onChange={(e) => this.handleChange('workerSearch', e.target.value)}/>
							</div>
						</div>
						<div className='employee-table-container'>
							<table className='employee-table'>
								<thead className='employee-table-head'>
									<tr>
										<td> Photo </td>
										<td> Name </td>
										<td> Phone </td>
										<td> Email </td>
										<td> 86 </td>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/44.jpg'/> </td>
										<td> Emily Kim</td>
										<td> (904)-751-4123 </td>
										<td> eK41@gmail.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/32.jpg'/> </td>
										<td> Adrian Chavez </td>
										<td> (904)-751-4123 </td>
										<td> bigmUn3y@exxon.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/44.jpg'/> </td>
										<td> Emily Kim</td>
										<td> (904)-751-4123 </td>
										<td> eK41@gmail.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/32.jpg'/> </td>
										<td> Adrian Chavez </td>
										<td> (904)-751-4123 </td>
										<td> bigmUn3y@exxon.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/44.jpg'/> </td>
										<td> Emily Kim</td>
										<td> (904)-751-4123 </td>
										<td> eK41@gmail.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/32.jpg'/> </td>
										<td> Adrian Chavez </td>
										<td> (904)-751-4123 </td>
										<td> bigmUn3y@exxon.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/44.jpg'/> </td>
										<td> Emily Kim</td>
										<td> (904)-751-4123 </td>
										<td> eK41@gmail.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/32.jpg'/> </td>
										<td> Adrian Chavez </td>
										<td> (904)-751-4123 </td>
										<td> bigmUn3y@exxon.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/44.jpg'/> </td>
										<td> Emily Kim</td>
										<td> (904)-751-4123 </td>
										<td> eK41@gmail.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/32.jpg'/> </td>
										<td> Adrian Chavez </td>
										<td> (904)-751-4123 </td>
										<td> bigmUn3y@exxon.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/44.jpg'/> </td>
										<td> Emily Kim</td>
										<td> (904)-751-4123 </td>
										<td> eK41@gmail.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/32.jpg'/> </td>
										<td> Adrian Chavez </td>
										<td> (904)-751-4123 </td>
										<td> bigmUn3y@exxon.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/44.jpg'/> </td>
										<td> Emily Kim</td>
										<td> (904)-751-4123 </td>
										<td> eK41@gmail.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/32.jpg'/> </td>
										<td> Adrian Chavez </td>
										<td> (904)-751-4123 </td>
										<td> bigmUn3y@exxon.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/44.jpg'/> </td>
										<td> Emily Kim</td>
										<td> (904)-751-4123 </td>
										<td> eK41@gmail.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/32.jpg'/> </td>
										<td> Adrian Chavez </td>
										<td> (904)-751-4123 </td>
										<td> bigmUn3y@exxon.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/44.jpg'/> </td>
										<td> Emily Kim</td>
										<td> (904)-751-4123 </td>
										<td> eK41@gmail.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/32.jpg'/> </td>
										<td> Adrian Chavez </td>
										<td> (904)-751-4123 </td>
										<td> bigmUn3y@exxon.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/44.jpg'/> </td>
										<td> Emily Kim</td>
										<td> (904)-751-4123 </td>
										<td> eK41@gmail.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
									<tr>
										<td> <img className='employee-avatar-image' src='./assets/avatars/32.jpg'/> </td>
										<td> Adrian Chavez </td>
										<td> (904)-751-4123 </td>
										<td> bigmUn3y@exxon.com </td>
										<td> <div className='fireButton'> Revoke Access </div> </td>
									</tr>
								</tbody>
							</table>
						</div>


					</div>
					<div className='feed-column'>
					</div>
				</div>
			</div>
		)
	}
}

export default AdminTerminal