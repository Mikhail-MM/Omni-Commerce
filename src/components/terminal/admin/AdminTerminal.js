import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../../styles/AdminTerminal.css'

import { showModal } from '../../../actions/modals'

const mapStateToProps = state => {
	const { token } = state.authReducer

	return { token }
}
const mapDispatchToProps = dispatch => ({
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
})


class AdminTerminal extends Component {
	state = {
		visibleCategory: 'employees',
		workerSearch: '',

		myEmployees: []
	}

	async componentDidMount() {
		const { token } = this.props
		console.log('token...:')
		console.log(token)
		const getEmployeesFunctionReturn = await this.findMyEmployees(token)
		console.log("My Employees function return:")
		console.log(getEmployeesFunctionReturn)
		this.setState({
			myEmployees: getEmployeesFunctionReturn
		})
	}

	findMyEmployees = (token) => {
		return fetch('http://localhost:3001/employees/find_all', {
				headers:{
					'Content-Type': 'application/json',
					'x-access-token': token,
				},
				method: 'GET',
				mode: 'cors'
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => {
				console.log("employees found: ", json)
				return json
			})
			.catch(err => console.log(err))
	}

	renderEmployeeTableToDOM = () => {
		const { myEmployees } = this.state
		console.log("What is my employees??: ", myEmployees)

		return myEmployees.map(employee => {
			if (employee.accountType === 'Terminal') return
			return(
				<tr>
					<td> <img className='employee-avatar-image' src={employee.avatarURL}/> </td>
						<td> {`${employee.firstName} ${employee.lastName}`}</td>
						<td> {employee.phone} </td>
						<td> {employee.email} </td>
						<td> <div className='fireButton'> Revoke Access </div> </td>
					</tr>
			)
		})
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
							<div className='add-employee-button' onClick={() => this.props.showModal('ADD_EMPLOYEE_MODAL', {regpathOmniChild: true})}>
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
									{ this.state.myEmployees && this.renderEmployeeTableToDOM() }
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminTerminal)