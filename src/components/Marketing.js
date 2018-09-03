import React, { Component } from 'react'
import { connect} from 'react-redux'

import ModalRoot from './ModalRoot'

import { showModal } from '../actions/modals'
import './styles/Marketing.css'

const mapDispatchToProps = dispatch => ({
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
})

class  Marketing extends Component {
	state = { 
		topOfPage: true, 
		scrollDir: null,
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll)
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll)
	}

	uniqueCollisionFreePrevScrollTop = null

	handleScroll = (event) => {
		let scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)

		if (this.uniqueCollisionFreePrevScrollTop && scrollTop > this.uniqueCollisionFreePrevScrollTop && this.state.scrollDir !== 'Scrolling Down') { 
			this.setState({
				scrollDir: 'Scrolling Down'
			})
		}
		if (this.uniqueCollisionFreePrevScrollTop && scrollTop < this.uniqueCollisionFreePrevScrollTop && this.state.scrollDir !== 'Scrolling Up') { 
			this.setState({
				scrollDir: 'Scrolling Up'
			})
		}
		if (!scrollTop && !!window.chrome && !!window.chrome.webstore) {
			scrollTop = event.path[1].scrollY
		}

		if (scrollTop > 0 && this.state.topOfPage === true) {
			this.setState({
				topOfPage: false
			})
		}
		if (scrollTop === 0 && !this.state.topOfPage) {
			this.setState({
				topOfPage: true,
				manageSticky: false
			})
		}
		if (this.stickyElContainer.getBoundingClientRect().y !== this.stickyEl.getBoundingClientRect().y && !this.state.manageSticky) { 
			this.setState({
				manageSticky: true
			})
		}
		if (this.stickyElContainer.getBoundingClientRect().y === this.stickyEl.getBoundingClientRect().y && this.state.manageSticky) {
			this.setState({
				manageSticky: false
			})
		}

		this.uniqueCollisionFreePrevScrollTop = scrollTop
	}
	render(){
			return(
				<div className='marketing-wrapper'>
					<ModalRoot />
					<div className='screen-resizer'>
					<div className='jumbo-image-container'>
						<nav className={`marketing-nav${(!this.state.topOfPage) ? ' collapseNavHeader' : ''}`}>
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
								onClick={() => this.props.showModal('REGISTRATION_MODULE_PICKER', {})}
							>
								Get Started
							</button>
							<button className='sign-in-button'>
								View Marketplace
							</button>
						</div>
					</div>
					</div>
					<div className='splash-intro'>
						<h2> Payments Made Easy! </h2>
						<p> Omni is an E-Commerce platform aimed at empowering small businesses and individual entrepreneurs by facilitating the ability to easily accept cash and credit card payments. </p>  
					</div>
					<div style={{width: '100vw', height: 5000}} ref={el => this.stickyElContainer = el}>
						<div className={`icon-revealer-container${(this.state.manageSticky) ? ' shrink-sticky' : ''}`} ref={el => this.stickyEl = el}>
							<div className='icon-revealer-row'>
								<div ref={el => this.img1 = el} className={`informatic-blurb abs-ico-co1${(this.state.manageSticky) ? ' co1-move' : ''}`}>
									<div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
										<img src='/assets/omni-splash/icons/payment-method.svg' />
									</div>
									<h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Compliant Payments </h4>
									<div className='informatic-blurb__text'>
									</div>
								</div>
								<div ref={el => this.img2 = el} className={`informatic-blurb abs-ico-co2${(this.state.manageSticky) ? ' co2-move' : ''}`}>
									<div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
										<img src='/assets/omni-splash/icons/online-shop.svg' />
									</div>
									<h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Remote Business Management </h4>
									<div className='informatic-blurb__text'>
									</div>
								</div>
								<div ref={el => this.img3 = el} className={`informatic-blurb abs-ico-co3${(this.state.manageSticky) ? ' co3-move' : ''}`}>
									<div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
										<img src='/assets/omni-splash/icons/stats.svg' />						
									</div>
									<h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Metrics and Statistics </h4>
									<div className='informatic-blurb__text'>
									</div>
								</div>
								<div ref={el => this.img4 = el} className={`informatic-blurb abs-ico-co4${(this.state.manageSticky) ? ' co4-move' : ''}`}>
									<div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
										<img src='/assets/omni-splash/icons/smartphone.svg' />
									</div>
									<h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Personal Marketplace </h4>
									<div className='informatic-blurb__text'>
									</div>
								</div>
							</div>
						</div>
						<div style={{width: '100vw', height: 5000}} />
					</div>
				</div>
			)
		}
}

export default connect(null, mapDispatchToProps)(Marketing)