import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendCashPaymentToApi } from '../actions/payments'

function mapStateToProps(state) {
	const authToken = state.authReducer.token;
	const { activeTicket } = state.ticketTrackingReducer
	return { authToken, activeTicket }
}

class CashPaymentForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			cashTenderedByCustomer: ''
		}
	this.handleCashTenderedChange = this.handleCashTenderedChange.bind(this)
	this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleCashTenderedChange(event) {
		event.preventDefault()
		this.setState({cashTenderedByCustomer: event.target.value})

	}

	handleSubmit(event) {
		event.preventDefault()
		const { authToken, activeTicket, dispatch } = this.props
		dispatch(sendCashPaymentToApi(authToken, this.state.cashTenderedByCustomer, activeTicket._id))
	}
	
	render() {
		return(
			<form onSubmit={this.handleSubmit}>
				<label>
					Cash Tendered By Customer (Dollars):
					<input type='text' value={this.state.cashTenderedByCustomer} onChange={this.handleCashTenderedChange} />
				</label>
				<input type='submit' value='Submit Customer Cash Paid' />
			</form>
		)
	}	
}

export default connect(mapStateToProps)(CashPaymentForm)