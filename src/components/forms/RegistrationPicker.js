import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../styles/RegistrationPicker.css'

import { push } from 'react-router-redux'

import { showModal, hideModal } from '../../actions/modals'

const mapDispatchToProps = (dispatch) => ({
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
	hideModal: () => dispatch(hideModal()),
	route: (node) => dispatch(push(node))
})


class RegistrationPicker extends Component {
	state = {
		pathway: null,
		renderButton: false,
	}

	handleRegistrationInitiationRequest = () => {
		if (this.state.pathway === 'Essos') {
			return this.props.showModal('AUTH_FORM_MODAL', {regpathEssos: true})
		} else if (this.state.pathway === 'Omni') {
			return this.props.showModal('AUTH_FORM_MODAL', {regpathOmniMaster: true})
		}
	}

	render() {
		return(
			<div className='registration-picker-wrapper'>
				
				<div className='centered-rectangle'>
					<button className='modal-corner-hide' onClick={() => this.props.hideModal()}> Close </button>
					<div className='picker-header-container'>
						<h1> Select Module </h1>
					</div>
					
					<div className='picker-button-container'>
						<div className='modalpicker-selector'>
							<div onClick={() => this.setState({pathway: 'Essos', renderButton: true})} className={(this.state.pathway === 'Essos') ? "icon-container activeIcon" : "icon-container"}>
								<img className="online-market-icon" src='./assets/registration/online-shop.svg' />
							</div>
							<h3 className={(this.state.pathway === 'Essos') ? "reg-selection-header activeHeader" : "reg-selection-header"}> Online Marketplace </h3>
						</div>
						<div className='modalpicker-selector'>
							<div onClick={() => this.setState({pathway: 'Omni', renderButton: true})} className={(this.state.pathway === 'Omni') ? "icon-container activeIcon" : "icon-container"}>
								<img style={{marginLeft: 10}} className="online-market-icon" src='./assets/registration/point-of-service.svg' />
							</div>
							<h3 className={(this.state.pathway === 'Omni') ? "reg-selection-header activeHeader" : "reg-selection-header"}> Point of Sale </h3>
						</div>
					</div>

					<div className="notification-box">
						{(!this.state.pathway) ? null : (this.state.pathway === 'Essos') ? 
							<h4 className='fade-in-text'> Register to buy and sell goods through the Essos online marketplace. Build an online brand and gain access to a variety of products. </h4>
							:
							<h4 className='fade-in-text'> Register to use our Point-of-Sale management service for your retail storefront. Accept cash and card payments, manage employees, and gain access to valuable statistics and analytics. </h4>
						}
					</div>
					{(this.state.renderButton) && <button className='fade-in-text' onClick={() => this.handleRegistrationInitiationRequest()}> Begin Registation </button> }
				</div>
			</div>
		)
	}
}

export default connect(null, mapDispatchToProps)(RegistrationPicker)