import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clockEmployeeIn, clockEmployeeOut } from '../actions/timeSheets'

import { Form, Button, Segment } from 'semantic-ui-react'


function mapStateToProps(state) {
	const { token } = state.authReducer;
	return { token }
}

class ClockInOutForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			employeeNumber: ''
		}
	this.handleChange = this.handleChange.bind(this);
	this.handleClockIn = this.handleClockIn.bind(this);
	this.handleClockOut = this.handleClockOut.bind(this)
	
	}

	handleChange(event) {
		event.preventDefault();
		this.setState(
			Object.assign({}, ...this.state, {employeeNumber: event.target.value}))
		console.log(this.state.employeeNumber)
	}

	// Dispatch a success modal
	handleClockIn(event) {
		console.log("Firing handleClockIn function")
		const { dispatch, token } = this.props
		event.preventDefault();
		console.log("Token: ")
		console.log(token)
		dispatch(clockEmployeeIn(token, this.state.employeeNumber))

	}
	
	handleClockOut(event) {
		const { dispatch, token } = this.props
		event.preventDefault();
		dispatch(clockEmployeeOut(token, this.state.employeeNumber))
	}
	
	render() {
		const { option } = this.props
		const ClockIn = (option === "Clock In")
		const ClockOut = (option === "Clock Out")
		return(
		<Segment className="timesheetEntryModal" raised>
		{ ClockIn && 
			<Form onSubmit={this.handleClockIn}>
				<Form.Input
					fluid
					placeholder='Employee Number'
					type='text'
					value={this.state.employeeNumber} 
					onChange={this.handleChange}
				/>
				<Form.Button fluid size='large' content='Submit'>Clock In</Form.Button>
			</Form> }
		{ ClockOut && 
			<Form onSubmit={this.handleClockOut}>
				<Form.Input
					fluid
					placeholder='Employee Number'
					type='text'
					value={this.state.employeeNumber} 
					onChange={this.handleChange}
				/>
				<Form.Button fluid size='large' content='Submit'>Clock Out</Form.Button>
			</Form>
		}
		</Segment>
		)
	}
}

export default connect(mapStateToProps)(ClockInOutForm)