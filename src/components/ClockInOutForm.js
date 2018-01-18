import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clockEmployeeIn, clockEmployeeOut } from '../actions/timeSheets'


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
		<div>
		{ ClockIn && 
			<form onSubmit={this.handleClockIn}>
				<label>
					Clock In Employee Number:
					<input type='text' value={this.state.employeeNumber} onChange={this.handleChange} />
				</label> 
				<input type="submit" value="submit"/>
			</form> }
		{ ClockOut && 
			<form onSubmit={this.handleClockOut}>
				<label>
					Clock Out Employee Number:
					<input type='text' value={this.state.employeeNumber} onChange={this.handleChange} />
				</label> 
				<input type="submit" value="submit"/>
			</form> 
		}
		
		</div>
		)
	}
}

export default connect(mapStateToProps)(ClockInOutForm)