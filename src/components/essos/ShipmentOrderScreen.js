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
							<div key={item._id} className='purchase-order__flex-row'>
								<div className='purchase-order__image-container'>
									<img src={item.imageURL} />
								</div>
								<div className='purchase-order__item-details'>
									{item.itemName}
									{item.numberRequested}
								</div>

								<div classname='purchase-order__item-status-container'>
									BUTTON...
								</div>
							</div>
						)
					})}
				</div>
			)
		})
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
