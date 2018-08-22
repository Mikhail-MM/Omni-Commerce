import React, { Component } from 'react'

import './styles/Marketing.css'

class Marketing extends Component {
	state = {}
	render(){
		return(
			<div className='marketing-wrapper'>
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
					<div className='container-overlay-content' >
						<h1> Content Here? </h1>
					</div>
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
}

export default Marketing