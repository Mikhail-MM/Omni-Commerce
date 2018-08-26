import React, { Component } from 'react'
import { connect } from 'react-redux'

import { showModal } from '../../actions/modals'

const mapStateToProps = state => {
	const { token } = state.authReducer
	return { token }
}

const mapDispatchToProps = dispatch => ({
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps))
})

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
			return (
				<div className='purchase-order-container'> 
					{request.itemsBought.map(item => {
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
									</div>
									<div onClick={() => this.props.showModal('ADD_REVIEW_MODAL', {item})}>
										Write Review
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)
		})
	}
	

	render() {
		const { purchaseHistory } = this.state

		return(
			<div style={{display: 'flex', flexDirection:'column', alignItems:'center', paddingRight: 25, paddingLeft: 25}}>
				{ purchaseHistory && this.renderPurchaseHistoryToDOM() }
			</div>
		)
	}


}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseHistoryScreen)