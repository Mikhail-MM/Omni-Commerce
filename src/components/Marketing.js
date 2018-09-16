import React, { Component } from 'react'
import { connect} from 'react-redux'

import ModalRoot from './ModalRoot'

import { showModal } from '../actions/modals'
import { routeToNode } from '../actions/routing'
import './styles/Marketing.css'

const mapDispatchToProps = dispatch => ({
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
	route: (node) => dispatch(routeToNode(node)),
})

class  Marketing extends Component {
	state = { 
		topOfPage: true,
		activeFeature: null, 
		scrollDir: null,
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll)
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll)
	}

	uniqueCollisionFreePrevScrollTop = null

	determineActiveFeature = (viewportCenter, objectOfVerticallyStackedRows) => {
		Object.keys(objectOfVerticallyStackedRows).forEach(featureKey => {
			const domRECT = objectOfVerticallyStackedRows[featureKey]
			if ((domRECT.top <= viewportCenter) && (domRECT.bottom >= viewportCenter)) return this.setState({
				activeFeature: featureKey
			})
		})
	}

	handleScroll = (event) => {
		let scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
		let viewportCenter = (window.innerHeight / 2)
		this.determineActiveFeature(viewportCenter, {ft1 : this.ft1.getBoundingClientRect(), ft2: this.ft2.getBoundingClientRect(), ft3: this.ft3.getBoundingClientRect(), ft4: this.ft4.getBoundingClientRect()})

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

		console.log("Sticky Container y Coord: ", this.stickyElContainer.getBoundingClientRect().y)
		console.log("Sticky Element y Coord: ", this.stickyEl.getBoundingClientRect().y)
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
						<nav className={`marketing-nav${(!this.state.topOfPage) ? ' collapseNavHeader' : ''}${(this.state.manageSticky) ? ' moveNavHeaderAway': ''}`}>
							<div className={`marketing-logo-container${(!this.state.topOfPage) ? ' collapseMarketLogo' : ''}`} >
								<img src={'/assets/TRANSLOGOthin.svg'} />
							</div>
							<div className='right-nav'>
								<a className='splash-link' onClick={() => this.props.route('/essos')}> Online Marketplace </a>
								<a className='splash-link' onClick={() => this.props.showModal('REGISTRATION_MODULE_PICKER', {})}> Register </a>
								<a className='splash-link' onClick={() => this.props.showModal('AUTH_FORM_MODAL', {
								login: true, loginOmni: true})}> Log In </a>
								
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
							<button className='sign-in-button' onClick={() => this.props.route('/essos')}>
								View Marketplace
							</button>
						</div>
					</div>
					</div>
					<div className='splash-intro'>
						<h2 style={{textAlign: 'center'}}> Payments Made Easy! </h2>
						<p> Omni is an E-Commerce platform aimed at empowering small businesses and individual entrepreneurs by facilitating the ability to easily accept cash and credit card payments. </p>  
					</div>
					<div style={{width: '100%', height: 'auto', backgroundColor: '#AA3939'}} ref={el => this.stickyElContainer = el}>
						<div className={`icon-revealer-container${(this.state.manageSticky) ? ' shrink-sticky' : ''}`} ref={el => this.stickyEl = el}>
							<div className='icon-revealer-row'>
								<div ref={el => this.img1 = el} style={(this.state.activeFeature === 'ft1') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} className={`informatic-blurb abs-ico-co1${(this.state.manageSticky) ? ' co1-move' : ''}`}>
									<div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
										<img src='/assets/omni-splash/icons/payment-method.svg' />
									</div>
									<h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Compliant Payments </h4>
									<div className='informatic-blurb__text'>
									</div>
								</div>
								<div ref={el => this.img2 = el} style={(this.state.activeFeature === 'ft2') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} className={`informatic-blurb abs-ico-co2${(this.state.manageSticky) ? ' co2-move' : ''}`}>
									<div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
										<img src='/assets/omni-splash/icons/online-shop.svg' />
									</div>
									<h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Remote Business Management </h4>
									<div className='informatic-blurb__text'>
									</div>
								</div>
								<div ref={el => this.img3 = el} style={(this.state.activeFeature === 'ft3') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} className={`informatic-blurb abs-ico-co3${(this.state.manageSticky) ? ' co3-move' : ''}`}>
									<div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
										<img src='/assets/omni-splash/icons/stats.svg' />						
									</div>
									<h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Metrics and Statistics </h4>
									<div className='informatic-blurb__text'>
									</div>
								</div>
								<div ref={el => this.img4 = el} style={(this.state.activeFeature === 'ft4') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} className={`informatic-blurb abs-ico-co4${(this.state.manageSticky) ? ' co4-move' : ''}`}>
									<div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
										<img src='/assets/omni-splash/icons/smartphone.svg' />
									</div>
									<h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Personal Marketplace </h4>
									<div className='informatic-blurb__text'>
									</div>
								</div>
							</div>
						</div>
						<div className='feature-set-container'>
							<div ref={el => this.ft1 = el } className={`feature-padded-row${(this.state.activeFeature === 'ft1') ? ' activate-feature' : ''}`} >
								<div className='feature-blurb feature-blurb__text'>
									<div className='blurb-center-wrapper'>
										<h2> Point of Sale Software </h2>
										<p> We provide flexible payment solutions for high volume businesses in retail and hospitality. No expensive hardware - our applications are compatible with all devices that can connect to the internet. </p>
										<p> Sign up for an account to build your store profile and accept payments securely. We utilize <a style={{textDecoration:'none'}}href='https://stripe.com'> Stripe </a> to ensure your information is secure from attackers. We use Stripe to securely process payments from any major credit card provider! </p>
									</div>
								</div>
								<div className='feature-blurb__image'>
									<img 
										src={'/assets/pos.jpg'}
										onClick={() => this.props.showModal('IMAGE_PREVIEW_MODAL', {animationKey: 'scaleIn', imageSourceString:'/assets/pos.jpg'})}
									/>
								</div>
							</div>
							<div ref={el => this.ft2 = el } className={`feature-padded-column${(this.state.activeFeature === 'ft2') ? ' activate-feature' : ''}`}>
								
								<div className='feature-blurb' style={{height: 'auto', width: '75%'}}>
									<img src={'/assets/screen-emps.png'} onClick={() => this.props.showModal('IMAGE_PREVIEW_MODAL', {animationKey: 'scaleIn', imageSourceString:'/assets/screen-emps.png'})}/>
								</div>
								<div className='feature-blurb feature-blurb__text' style={{height: 'auto', marginTop: 50}}>
									<div>
										<h2 style={{textAlign: 'center'}}> Employee Management </h2>
										<p> Employee management has never been easier! Keep track of hiring and individual performance with our Admin dashboard. Live feed ensures that you're always kept up-to-date with the minute-to-minute details of running your business without actually having to be there.</p>
									</div>
								</div>
							</div>
							<div ref={el => this.ft3 = el } className={`feature-padded-row${(this.state.activeFeature === 'ft3') ? ' activate-feature' : ''}`}>
								<div className='feature-blurb__image' style={{height: '650px', width: '650px'}}>
									<img 
										src={'/assets/stats.jpg'}
										onClick={() => this.props.showModal('IMAGE_PREVIEW_MODAL', {animationKey: 'scaleIn', imageSourceString:'/assets/externalReference/profilepagedesign.png'})}
									/>
								</div>
								<div className='feature-blurb feature-blurb__text'>
									<div className='blurb-center-wrapper'>
										<h2> Metrics & Sales Reporting </h2>
										<p> Evaluate the health of your business with detailed sales reports sent to your account, accessible anywhere. See your top performers, best selling products, and sales trends with the push of a button. Aggregate business performance over time to track gross sales against cost. </p>
									</div>
								</div>
							</div>
							<div ref={el => this.ft4 = el } className={`feature-padded-row${(this.state.activeFeature === 'ft4') ? ' activate-feature' : ''}`}>
								<div className='feature-blurb feature-blurb__text'>
									<div className='blurb-center-wrapper'>
										<h2> Online Marketplace </h2>
										<p> Sell your stuff online through our marketplace! Connect with other entrepreneurs, find awesome deals, and more! </p>
										<p> You don't have to be a brick-and-mortar business to take advantage of E-Commerce </p>
									</div>
								</div>
								<div className='feature-blurb' style={{height: 500, width: 700}}>	
									<img src={'/assets/screen-market.jpg'} onClick={() => this.props.showModal('IMAGE_PREVIEW_MODAL', {animationKey: 'scaleIn', imageSourceString:'/assets/screen-market.jpg'})}/>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
}

export default connect(null, mapDispatchToProps)(Marketing)