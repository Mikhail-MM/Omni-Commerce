import React, { Component } from 'react'
import { connect } from 'react-redux'

import { clockEmployeeIn, clockEmployeeOut } from '../../actions/timesheets'

const mapStateToProps = state => {

	const { token } = state.authReducer;
	return { token };

}

const mapDispatchToProps = dispatch => ({
	
	clockEmployeeIn: (event, token, employeeNumber) => {
		event.preventDefault();
		return dispatch(clockEmployeeIn(token, employeeNumber))
	},

	clockEmployeeOut: (token, employeeNumber) => {
		event.preventDefault();
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

	
	render() {
		const { token } = this.props;

		return(
			<div>
			{ this.props.option === 'Clock In' && 
				<form onSubmit={(event) => this.props.clockEmployeeIn(event, token, this.state.employeeNumber)}>
					<input
						placeholder='Employee Number'
						type='text'
						value={this.state.employeeNumber} 
						onChange={(event) => this.handleChange}
					/>
					<button content='Submit'>Clock In</button>
				</form> }
			{ this.props.option === 'Clock Out' && 
				<form onSubmit={(event) => this.props.clockEmployeeOut(event, token, this.state.employeeNumber)}>
					<input
						placeholder='Employee Number'
						type='text'
						value={this.state.employeeNumber} 
						onChange={this.handleChange}
					/>
					<button content='Submit'>Clock Out</button>
				</form>
			}
			</div>
		)
	}
}

export default connect(mapStateToProps)(ClockInOutForm)