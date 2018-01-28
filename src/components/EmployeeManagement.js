// This is an Admin Only Component. 
import React, { Component } from 'react'
import { connect } from 'react-redux'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { employees } = state.employeeManagementReducer
	return { token, employees }
}

class EmployeeManagement extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
		this.showEmployeeMenu = this.showEmployeeMenu.bind(this)

	}

	showEmployeeMenu() {
		const { employees } = this.props
		return employees.map(
			return <div>This is an employee</div>
		)
	}
	render() {
		const { employees } = this.props
		return(
			<div>
				<h4>
					You should be able to see all of your employees here - Hire, Fire, and Enroll New Applicants
				</h4>
				{employees && this.showEmployeeMenu}
			</div>
		)
	}
}

export default connect(mapStateToProps)(EmployeeManagement);