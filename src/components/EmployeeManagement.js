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
						<Button onClick={this.validateEmployee.bind(this, employee._id)}> Approve Employee </Button>
						<Button onClick={this.invalidateEmployee.bind(this, employee._id)}> Remove Employee </Button>
					</div>
				</div>
			)
		});
	}

	render() {
		const { employees } = this.props;
		return(
			<Item.Group divided className='employee-management-ui-container'>
				{employees && this.drawEmployeeMenu()}
			</Item.Group>
		)
	}
}

export default connect(mapStateToProps)(EmployeeManagement);