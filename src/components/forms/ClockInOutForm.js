import React, { Component } from 'react'
import { connect } from 'react-redux'

import { clockEmployeeIn, clockEmployeeOut } from '../../actions/timesheets'

const mapStateToProps = state => {

	const { token } = state.authReducer;
	return { token };

}

const mapDispatchToProps = dispatch => ({
	
	clockEmployeeIn: (token, employeeNumber) => {
		return dispatch(clockEmployeeIn(token, employeeNumber))
	},

	clockEmployeeOut: (token, employeeNumber) => {
		return dispatch(clockEmployeeOut(token, employeeNumber))
	},

})
class ClockInOutForm extends Component {

	state = {
		employeeNumber: ''
	};

	handleChange = (event) => {

		event.preventDefault();

		this.setState({
			employeeNumber: event.target.value
		});
		
	};

	handleSubmit = (event, token, employeeNumber) => {
		event.preventDefault();

		if (this.props.option === 'Clock In') return this.props.clockEmployeeIn(token, employeeNumber)
		if (this.props.option === 'Clock Out') return this.props.clockEmployeeOut(token, employeeNumber)
	}
	render() {
		const { token } = this.props;

		return(
			<div>
			{ this.props.option === 'Clock In' && 
				<form onSubmit={(e) => this.handleSubmit(e, token, this.state.employeeNumber)}>
					<input
						placeholder='Employee Number'
						type='text'
						value={this.state.employeeNumber} 
						onChange={(e) => this.handleChange(e)}
					/>
					<button content='Submit'>Clock In</button>
				</form> }
			{ this.props.option === 'Clock Out' && 
				<form onSubmit={(e) => this.handleSubmit(e, token, this.state.employeeNumber)}>
					<input
						placeholder='Employee Number'
						type='text'
						value={this.state.employeeNumber} 
						onChange={(e) => this.handleChange(e)}
					/>
					<button content='Submit'>Clock Out</button>
				</form>
			}
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ClockInOutForm)