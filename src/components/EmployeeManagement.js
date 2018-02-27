// This is an Admin Only Component. 
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Item, Button } from 'semantic-ui-react'
import { fetchAllEmployees, authorizeEmployeePrivileges, invalidateEmployeePrivileges } from '../actions/employees'

import employeeFace from '../assets/image-2.png'
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
		return employees.map(employee => {
			return(
				<Item>
					<Item.Image avatar size='tiny' src={employeeFace} />

					<Item.Content>
							<Item.Header> {employee.firstName} {employee.lastName} </Item.Header>
							<Item.Meta> Waiter </Item.Meta>
							<Item.Description> <Icon name=""/>Some sort of description stuff</Item.Description>
							<Item.Extra>
								<Button onClick={this.validateEmployee.bind(this, employee._id)}> Approve Employee </Button>
								<Button onClick={this.invalidateEmployee.bind(this, employee._id)}> Remove Employee </Button>
							</Item.Extra>
					</Item.Content>
				</Item>
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