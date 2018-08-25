import React, { Component } from 'react'
import { connect } from 'react-redux'

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
		console.log(this.props)
		const shipmentRequests = await this.fetchShipmentRequests(token)
		console.log(shipmentRequests)
		if (shipmentRequests) this.setState({
			shipmentRequests: shipmentRequests
		})
	}

	fetchShipmentRequests = async (token) => {
		return fetch('http://localhost:3001/sellorders/userLookup/', {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,
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
			return(
				<div key={request._id} className='purchase-order-container'> 
					{request.itemsBought.map(item=> {
						return (
							<div className='purchase-order__flex-row'>
								<div className='purchase-order__image-container'>
									<img src={item.imageURL} />
								</div>
								<div className='purchase-order__item-details'>
									{item.itemName}
									{item.numberRequested}
								</div>
								<div className='purchase-order__item-status-container'>
									<div className={`order-status-button ${item.status}`}>
										{item.status}
										<div className='order-status-button__dropdown-container'>
											<div className='order-status-button shipped' onClick={() => this.handleStatusUpdate(request._id, item._id, 'Shipped') }>
												Shipped
											</div>
											<div className='order-status-button delayed' onClick={() => this.handleStatusUpdate(request._id, item._id, 'Delayed')}>
												Delayed
											</div>
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)
		})
	}

	handleStatusUpdate = (requestId, itemId, newStatus) => {
		const { token } = this.props

		return fetch('http://localhost:3001/essos/updateOrderStatus', {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,			
			},
			method: 'PUT',
			mode: 'cors',
			body: JSON.stringify({
				sellOrderId: requestId,
				itemSubdocId: itemId,
				status: newStatus 
			})
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => console.log(json))
		.catch(err => console.log(err))

	}

	render() {
		const { shipmentRequests } = this.state
		console.log(shipmentRequests)
		return(
			<div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
				{ shipmentRequests && this.renderShipmentRequestsToDOM() }
			</div>
		)
	}


}
export default connect(mapStateToProps)(ShipmentOrderScreen)
