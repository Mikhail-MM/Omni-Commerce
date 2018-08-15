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
		allReports: []
	}

	async componentDidMount() {
		const { token } = this.props
		const gotReports = await this.fetchAllSalesReports(token)

		this.setState({
			allReports: gotReports
		})
	}

	fetchAllSalesReports = (token) => {
		return fetch('http://localhost:3001/salesReports', {
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

	renderSaleReportTableToDOM = () => {
		const { allReports } = this.state

		return allReports.map(report => {
			return(
				<tr>
					<td> {moment(report.beginDate).format('MMMM Do YYYY, h:mm:ss a')} </td>
					<td> {moment(report.endDate).format('MMMM Do YYYY, h:mm:ss a')} </td>
					<td> {report.tickets.length} </td>
					<td> {report.gross} </td>
				</tr>
			)
		}) 
	}
	render() {
		return(
				<div className='action-column'>
					<div className='analytics-table-container'>
						<table className='analytics-table'>
							<thead className='analytics-table-head'>
								<tr>
									<td> First Sale </td>
									<td> Last Sale </td>
									<td> Total Transactions </td>
									<td> Gross Sales </td>
								</tr>
							</thead>
							<tbody>
								{ this.state.allReports && this.renderSaleReportTableToDOM() }
							</tbody>
						</table>
					</div>
				</div>

		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesAnalyticsContainer)