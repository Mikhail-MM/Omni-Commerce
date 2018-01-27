import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux'
import {scaleTime, domain, range} from 'd3-scale'
import {timeMinute} from 'd3-time'
import moment from 'moment'

import { lookUpSalesReportsByDate } from '../actions/menu-items' 

import {BarChart, Bar, getTicks, LineChart, Line, XAxis, YAxis, Legend, CartesianGrid, Tooltip} from 'recharts'
import 'react-datepicker/dist/react-datepicker.css';

function mapStateToProps(state) {
const { token } = state.authReducer
const { activeSalesReport } = state.salesReportReducer
return { token, activeSalesReport }
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
		this.dateFormat = this.dateFormat.bind(this)
	
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

	dateFormat = (time) => {
	return moment(time).format('HH:mm');
	};

	getTicks = (data) => {
	if (!data || !data.length ) {return [];}
  
 	   const domain = [new Date(data[0].time), new Date(data[data.length - 1].time)];
	   const scale = scaleTime().domain(domain).range([0, 1]);
 	   const ticks = ticks(timeMinute, 5);
  
 	 return ticks.map(entry => +entry);
	};

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
		const { activeSalesReport } = this.props
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
				{activeSalesReport && 
					<div>
					<BarChart width={600} height={400} data={activeSalesReport.grossByMenuItem}>
						<XAxis dataKey="dataKey" angle={-45} textAnchor="end"/>
						<YAxis />
						<Tooltip />
						<Bar dataKey = "dataValue" />
					</BarChart >
					</div> }
					{activeSalesReport && 
					<div>
					<BarChart width={600} height={400} data={activeSalesReport.grossByCategory}>
						<XAxis dataKey="dataKey" angle={-45} textAnchor="end"/>
						<YAxis />
						<Tooltip />
						<Bar dataKey = "dataValue" />
					</BarChart >
					</div>}
					
					{activeSalesReport && <div>
					<BarChart width={600} height={400} data={activeSalesReport.grossByServer}>
						<XAxis dataKey="dataKey" angle={-45} textAnchor="end"/>
						<YAxis />
						<Tooltip />
						<Bar dataKey = "dataValue" />
					</BarChart >
					</div>}
					{activeSalesReport && <div> 

					<LineChart width={3000} height={250} data={activeSalesReport.salesOverTime}
					  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
					  <XAxis dataKey="time" ticks={this.getTicks(activeSalesReport.salesOverTime.time)} tickFormatter={this.dateFormat}/>
					  <YAxis />
					  <Tooltip />
					  <Legend />
					  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
					</LineChart>

					</div>}
			</div>
			
		)
	}
}

export default connect(mapStateToProps)(SalesAnalytics)