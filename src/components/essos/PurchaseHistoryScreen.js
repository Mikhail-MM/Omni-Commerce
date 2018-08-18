import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => {
	const { token } = state.authReducer
	return { token }
}

class PurchaseHistoryScreen extends Component {
	state = {
		purchaseHistory: [],
	}

	async componentDidMount() {
		const { token } = this.props
		const purchaseHistory = await this.fetchPurchaseHistory(token)

		if (purchaseHistory) this.setState({
			purchaseHistory: purchaseHistory
		})
	}

	fetchPurchaseHistory = async (token) => {
		return fetch('http://localhost:3001/purchaseorders/userLookup/', {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors',		
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			console.log("Found Purchase History: ", json)
			return json
		})
		.catch(err => console.log(err))
	}

	renderPurchaseHistoryToDOM = () => {
		const { purchaseHistory } = this.state

		return purchaseHistory.map(request => {
			return <div> request._id </div>
		})
	}

	render() {
		const { purchaseHistory } = this.state

		return(
			<div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
				{ purchaseHistory && this.renderPurchaseHistoryToDOM() }
			</div>
		)
	}


}
export default connect(mapStateToProps)(PurchaseHistoryScreen)