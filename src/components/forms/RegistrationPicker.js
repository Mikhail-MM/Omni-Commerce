import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../styles/RegistrationPicker.css'

import { push } from 'react-router-redux'

const mapDispatchToProps = (dispatch) => ({
	route: (node) => dispatch(push(node))
})


class RegistrationPicker extends Component {
	render() {
		return(
			<div className='registration-picker-wrapper'>
				
				<div className='centered-rectangle'>

					<div className='picker-header-container'>
						<h1> Registration </h1>
					</div>
					
					<div className='picker-button-container'>
						<div onClick={(event) => this.props.route('/register/essos') } className='icon-container'>
							<img className="online-market-icon" src='./assets/registration/online-shop.svg' />
						</div>
						<div onClick={(event) => this.props.route('/register/omni')} className='icon-container'>
							<img className="point-sale-icon" src='./assets/registration/point-of-service.svg' />
						</div>
					</div>

					<div className="notification-box">
						<div>
							Register to buy and sell goods through the Essos online marketplace. Build an online brand and gain access to a variety of products. 
						</div>
						<div>
							Register to use our Point-of-Sale management service for your retail storefront. Accept cash and card payments, manage employees, and gain access to valuable statistics and analytics.
						</div>
					</div>

				</div>
			</div>
		)
	}
}

export default connect(null, mapDispatchToProps)(RegistrationPicker)