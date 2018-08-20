import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

const mapStateToProps = state => {
	const { token } = state.authReducer
	return { token }
}

const mapDispatchToProps = dispatch => ({

})

class SalesAnalyticsContainer extends Component {
	state = {
		allTimeSheets: []
	}

	async componentDidMount() {
		const { token } = this.props
		const gotTimeSheets = await this.fetchAllSalesReports(token)

		this.setState({
			allTimeSheets: gotTimeSheets
		})
	}

	fetchAllSalesReports = (token) => {
		return fetch('http://localhost:3001/timesheets', {
				headers:{
					'Content-Type': 'application/json',
					'x-access-token': token,
				},
				method: 'GET',
				mode: 'cors'
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => {
				return json
			})
			.catch(err => console.log(err))
	}

	renderTimeSheetTableToDOM = () => {
		const { allTimeSheets } = this.state

		return allTimeSheets.map(timesheet => {
			return(
				<tr>
					<td> {timesheet.name} </td>
					<td> {moment(timesheet.timeIn).format('MMMM Do YYYY, h:mm:ss a')} </td>
					<td> {moment(timesheet.timeOut).format('MMMM Do YYYY, h:mm:ss a')} </td>
					<td> { timesheet.timeOut && moment.duration(moment(timesheet.timeOut).diff(moment(timesheet.timeIn))).asHours() } </td>
				</tr>
			)
		}) 
	}
	render() {
		const { allTimeSheets } = this.state

		return(
				<div className='action-column'>
					<div className='analytics-table-container'>
						<table className='analytics-table'>
							<thead className='analytics-table-head'>
								<tr>
									<td> Name </td>
									<td> Time In </td>
									<td> Time Out </td>
									<td> Hours Worked </td>
								</tr>
							</thead>
							<tbody>
								{ allTimeSheets && this.renderTimeSheetTableToDOM() }
							</tbody>
						</table>
					</div>
				</div>

		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesAnalyticsContainer)