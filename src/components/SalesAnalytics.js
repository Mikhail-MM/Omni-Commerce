import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux'
import moment from 'moment'

import { lookUpSalesReportsByDate } from '../actions/menu-items' 

import 'react-datepicker/dist/react-datepicker.css';

function mapStateToProps(state) {
	const { token } = state.authReducer
return { token }
}

class SalesAnalytics extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectMultiple: false,
			startDate: moment(),
			endDate: moment()
		};
		this.handleStartChange = this.handleStartChange.bind(this)
		this.handleEndChange = this.handleEndChange.bind(this)
		this.requestSalesData = this.requestSalesData.bind(this)
	
	}

	handleStartChange(date) {
		this.setState({
			startDate: date
		})
	}
	
	handleEndChange(date) {
		this.setState({
			endDate: date
		})
	}

	requestSalesData() {
		const { token, dispatch } = this.props
		
		console.log("Requesting Sales Data: ")
		console.log("Begin:")
		console.log(this.state.startDate)
		console.log("End:")
		console.log(this.state.endDate)
		dispatch(lookUpSalesReportsByDate(token, this.state.startDate, this.state.endDate))
	}
	render() {
		const { selectMultiple } =  this.state 
		return(

			<div>
				<h2>Analytics Begin: </h2>
				<DatePicker
					selected={this.state.startDate}
					onChange={this.handleStartChange} 
					showTimeSelect
					dateFormat="LLL" />
				<h2>Analytics End: </h2>
				<DatePicker
					selected={this.state.endDate}
					onChange={this.handleEndChange}
					showTimeSelect
					dateFormat="LLL" />
			<button onClick={this.requestSalesData}>Get Analytics</button>
			</div>
			
		)
	}
}

export default connect(mapStateToProps)(SalesAnalytics)