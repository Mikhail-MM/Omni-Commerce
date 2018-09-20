import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { VictoryChart, VictoryAxis, VictoryTheme, VictoryLine, VictoryPie, VictoryTooltip, VictoryBar } from 'victory'
import { getSalesReportById } from '../../../actions/sales-reporting'


const mapStateToProps = state => {
	const { token } = state.authReducer
	const { salesReport, reportLoaded } = state.salesReportReducer
	return { token, salesReport, reportLoaded }
}

const mapDispatchToProps = dispatch => ({
	loadSalesReport:(token, id) => dispatch(getSalesReportById(token, id)),
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
		return fetch('/salesReports', {
				headers:{
					'Content-Type': 'application/json',
					'x-access-token': token,
				},
				method: 'GET',
			})
			.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
			.then(json => {
				return json
			})
			.catch(err => console.log(err))
	}

	renderSaleReportTableToDOM = () => {
		const { allReports } = this.state
		const { token } = this.props

		return allReports.map(report => {
			return(
				<tr onClick={() => this.props.loadSalesReport(token, report._id)}>
					<td> {moment(report.beginDate).format('MMMM Do YYYY, h:mm:ss a')} </td>
					<td> {moment(report.endDate).format('MMMM Do YYYY, h:mm:ss a')} </td>
					<td> {report.tickets.length} </td>
					<td> {report.gross} </td>
				</tr>
			)
		}) 
	}

	renderChartsToDOM = () => {
		const { salesReport, reportLoaded } = this.props

		console.log(salesReport)
		console.log(salesReport.categoryMetrics)
		const formatCategoryPie = salesReport.categoryMetrics.map(categoryData => {
			return {x: categoryData.dataKey, y: categoryData.dataValue}
		})

		const formatItemPie = salesReport.menuItemGross.map(itemData => {
			return {x: itemData.dataKey, y: itemData.dataValue }
		})
		console.log(salesReport.menuItemGross.map(itemData=>itemData.dataKey))
		return(
			<div>
				<div className='chart-container__full-row'>
					<h2> Gross Sales </h2>
					<div className='gross-chart-dimensions'>
						<VictoryChart
				           theme={VictoryTheme.material}
				         >
				           <VictoryAxis
				             tickValues={salesReport.timeSeriesData.map(timeseries=>timeseries.time)}
				             tickFormat={salesReport.timeSeriesData.map(timeseries=>{
				               return moment(timeseries.time).format('h:mm: a')
				             })}
				             scale='time'
				             style={{ 
				             tickLabels:{ 
				               angle: 45,
				               fontSize: 8
				             }
				             }}
				           />
				           <VictoryAxis
				             dependentAxis
				             tickFormat={(y) => `$${y}`}
				           />
				           <VictoryLine
				             data={salesReport.timeSeriesData}
				             x='time'
				             y='sales'
				           />
				        </VictoryChart>
					</div>
				</div>
				<div className='chart-container__columns'>
					<div className='itembars-container'>
			        	<VictoryChart
			        	 /* Domain Padding prevents the data from overlapping axes */
			         	 theme={VictoryTheme.material}
			         	 domainPadding={20}
				        >
				          <VictoryAxis
				            tickValues={salesReport.menuItemGross.map(datapoint=> datapoint.dataKey)}
				            tickFormat={salesReport.menuItemGross.map(datapoint=> datapoint.dataKey)}
				            style={{ 
				              tickLabels:{ 
				                angle: 45,
				                fontSize: 4
				              }
				            }}
				          />
				          <VictoryAxis
				            dependentAxis
				            tickFormat={(y) => `$${y}`}
				          />
				           <VictoryBar 
				             data={salesReport.menuItemGross}
				             x='dataKey'
				             y='dataValue'
				           />
				        </VictoryChart>
			        </div>
					<div className='half-column-chartcontainer-divider'>
						<div className='itempie-chart-container'>
							<VictoryPie
								data={formatItemPie}
								padAngle={0.25}
		 						innerRadius={100}
		 						labelComponent={<VictoryTooltip/>}
								theme={VictoryTheme.material}
							/>
						</div>
						<div className='category-pie-container'>
							<VictoryPie
								data={formatCategoryPie}
								theme={VictoryTheme.material}
							/>
						</div>
					</div>
				</div>

			</div>
		)
	}

	render() {
		const { salesReport, reportLoaded } = this.props
		return(
				<div className='action-column'>
					<div className='analytics-charts-container'>
						{ salesReport && reportLoaded && this.renderChartsToDOM()}
					</div>
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
							<tbody className='omni-table-body'>
								{ this.state.allReports && this.renderSaleReportTableToDOM() }
							</tbody>
						</table>
					</div>
				</div>

		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesAnalyticsContainer)