// This is an Admin Only Component. 
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Item, Button } from 'semantic-ui-react'
import { fetchAllEmployees, authorizeEmployeePrivileges, invalidateEmployeePrivileges } from '../actions/employees'


function mapStateToProps(state) {
	const { token } = state.authReducer
	const { employees } = state.employeeReducer
	return { token, employees }
}

class EmployeeManagement extends Component {
	constructor(props) {
		super(props);
		this.drawEmployeeMenu = this.drawEmployeeMenu.bind(this);
	}

	componentDidMount() {
		const { dispatch, token } = this.props;
		dispatch(fetchAllEmployees(token))

	}

	validateEmployee(employeeId){
		const { dispatch, token } = this.props;
		dispatch(authorizeEmployeePrivileges(token, employeeId))
	}
	invalidateEmployee(employeeId){
		const { dispatch, token } = this.props;
		dispatch(invalidateEmployeePrivileges(token, employeeId))
	}

	drawEmployeeMenu() {
		const { employees } = this.props
		return employees.map( (employee, index) => {
			const stockAvatarUrl = "/assets/employees/image-" + (index + 2 % 20) + ".png"

			return(
				<div className="employee-window">
					<div className="employee-avatar-container">
						<img className="employee-avatar" src={stockAvatarUrl} />
					</div>
					<div className="employee-metadata-table">
						<div className="employee-metadata-container-1">
							<section className="employee-contact-section" >
								<h3 className="employee-name">{employee.firstName} {employee.lastName} </h3>
								<p className="employee-phone">Phone: {employee.phoneNumber} </p>
								<p className="employee-mail">E-Mail: {employee.email}</p>
							</section>
						</div>
						<div className="employee-metadata-container-2">
							<section className="employee-contact-section" >
								{employee.isMaster && 
									<p> Manager </p>
								}
								{!employee.isMaster && 
									<p> Employee </p>
								}
								<Button onClick={this.validateEmployee.bind(this, employee._id)}> Approve Employee </Button>
								<Button onClick={this.invalidateEmployee.bind(this, employee._id)}> Remove Employee </Button>
							</section>
						</div>

					</div>
				</div>
			)
		});
	}

	render() {
		const { employees } = this.props;
		return(
			<div className='employee-management-ui-container'>
				{employees && this.drawEmployeeMenu()}
			</div>
		)
	}
}

export default connect(mapStateToProps)(EmployeeManagement);