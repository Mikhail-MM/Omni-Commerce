import React, { Component } from 'react'
import { connect } from 'react-redux'
export function retrieveAllMyPurchaseOrders(token) {
	return dispatch => {
		return fetch('http://localhost:3001/purchaseorders/userLookup/', {
			headers: {
				'Content/Type': 'application-json'
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receivePurchaseOrders(json)))
		.catch(err => console.log(err))

	}
}

export function retrieveAllMySalesOrders(token) {
	return dispatch => {
		return fetch('http://localhost:3001/sellorders/userLookup/',{
			headers: {
				'Content/Type': 'application-json'
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors',
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => dispatch(receiveShippingOrders(json)))
		.catch(err => console.log(err))
	}
}

const mapStateToProps = state => {
	const { token } = state.authReducer
	return { token }
}

class ShipmentOrderScreen extends Component {
	state = {
		shipmentRequests: [],
	}

	async componentDidMount() {
		const { token } = this.props
		const shipmentRequests = await fetchShipmentRequests(token)

		if (shipmentRequests) this.setState({
			shipmentRequests: shipmentRequests
		})
	}

	fetchShipmentRequests = async (token) => {
		return fetch('http://localhost:3001/sellorders/userLookup/', {
			headers: {
				'Content/Type': 'application-json'
				'x-access-token': token
			},
			method: 'GET',
			mode: 'cors',		
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => {
			console.log("Found Shipment Orders: ", json)
			return json
		})
		.catch(err => console.log(err))
	}

	renderShipmentRequestsToDOM = () => {
		const { shipmentRequests } = this.state

		return shipmentRequests.map(request => {
			return <div> request._id </div>
		})
	}

	render() {
		const { shipmentRequests } = this.state

		return(
			<div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
				{ shipmentRequests && this.renderShipmentRequestsToDOM() }
			</div>
		)
	}


}
export default connect(mapStateToProps)(ShipmentOrderScreen)