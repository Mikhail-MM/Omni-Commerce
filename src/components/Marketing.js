import React, { Component } from 'react'
import { connect} from 'react-redux'

import ModalRoot from './ModalRoot'

import { showModal } from '../actions/modals'
import './styles/Marketing.css'

const mapDispatchToProps = dispatch => ({
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
})

const Marketing = (props) => {
		return(
			<div className='marketing-wrapper'>
				<ModalRoot />
				<div className='screen-resizer'>
				<div className='jumbo-image-container'>
					<nav className='marketing-nav'>
						<div className='left-nav' >
							Logo
							About
							Product
						</div>
						<div className='right-nav'>
							Log In
						</div>
					</nav>
					<img src='/assets/omni-splash/jumbo-blur.jpg' />
					<div className='hero-header-1' >
						Running a Business is a <span style={{color: '#FF4734'}}> Challenge </span>
					</div>
					<div className='hero-header-2' >
						We're Here to Help
					</div>
					<div className='hero-header-3' >
						<button 
							className='getting-started-button'
							onClick={() => props.showModal('REGISTRATION_MODULE_PICKER', {})}
						>
							Get Started
						</button>
						<button className='sign-in-button'>
							View Marketplace
						</button>
					</div>
				{/* 
					<div className='hero-header-4'>
						See More
					</div>
				*/}
				</div>
				</div>
				<div className='splash-intro'>
					<h2> Payments Made Easy! </h2>
					<p> Omni is an E-Commerce platform aimed at empowering small businesses and individual entrepreneurs by facilitating the ability to easily accept cash and credit card payments. </p>  
				</div>
				<div className='icon-revealer-container'>
					<div className='icon-revealer-row'>
						<div className='informatic-blurb'>
							<div className='informatic-blurb__icon'>
								<img src='/assets/omni-splash/icons/payment-method.svg' />
							</div>
							<h4> Compliant Payments </h4>
							<div className='informatic-blurb__text'>
							</div>
						</div>
						<div className='informatic-blurb'>
							<div className='informatic-blurb__icon'>
								<img src='/assets/omni-splash/icons/online-shop.svg' />
							</div>
							<h4> Remote Business Management </h4>
							<div className='informatic-blurb__text'>
							</div>
						</div>
						<div className='informatic-blurb'>
							<div className='informatic-blurb__icon'>
								<img src='/assets/omni-splash/icons/stats.svg' />						
							</div>
							<h4> Metrics and Statistics </h4>
							<div className='informatic-blurb__text'>
							</div>
						</div>
						<div className='informatic-blurb'>
							<div className='informatic-blurb__icon'>
								<img src='/assets/omni-splash/icons/smartphone.svg' />
							</div>
							<h4> Personal Marketplace </h4>
							<div className='informatic-blurb__text'>
							</div>
						</div>
					</div>
				</div>

			</div>
		)
}

export default connect(null, mapDispatchToProps)(Marketing)