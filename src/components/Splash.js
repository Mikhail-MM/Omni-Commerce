import React, { Component } from 'react'

import { Button } from 'semantic-ui-react'
class Splash extends Component {
	constructor(props){
		super(props)
	}

	render() {
		return(
			<div className="splash-page-wrapper">
				<div className='vh100'>
				<div className="jumbo-image-container">
					<nav className="main-nav">
						<div className="left-nav" >
							Logo
							About
							Product
						</div>
						<div className="right-nav">
							<Button> Log In </Button>
						</div>
					</nav>
					<img className="jumbo-image-blurred" src={'/assets/jumbo.jpg'} />
					<div className="container-overlay-content" >
						<h1> Content Here? </h1>
					</div>
				</div>
				</div>
				<div className="splash-intro">
					<h2> Payments Made Easy! </h2>
					<p> Omni is an E-Commerce platform aimed at empowering small businesses and individual entrepreneurs by facilitating the ability to easily accept cash and credit card payments. </p>  
				</div>
				<div className="splash-animated-infographic">
					<div className="splash-1-2-col">
						<h3> Track important metrics across your business, handle transactions remotely! </h3>
						<p> Track performance on an item-by-item basis to optimize your sales plan and maximize business performance. </p>
					</div>
					<div className="splash-1-2-col">
						<img className="splash-register" src={'/assets/cashmachineicon.png'}/>
					</div>
				</div>
				<div className="splash-animated-infographic">
					<div className="splash-1-2-col">
						<h3> Marketplace Pic </h3>
					</div>
					<div className="splash-1-2-col">
						<h3> Build your personalized marketplace! </h3>
						<p> Sell items, and ship anything across the country!  </p>
					</div>
				</div>
				<div className="splash-animated-infographic">
					<div className="splash-1-2-col">
						<h3> Accept Credit-Card & Cash Payments via a convenient web Point-Of-Sale </h3>
						<p>  </p>
					</div>
					<div className="splash-1-2-col">
						<h3> This side should have a pic of the rudimentary POS interface</h3>
					</div>
				</div>
				<div className="splash-animated-infographic">
					<div className="splash-1-2-col">
						<h3> This side should have a pic of the admin dashboard</h3>
					</div>
					<div className="splash-1-2-col">
						<h3> Manage Your Business Remotely </h3>
						<p> Get access to the vitals of your business from anywhere with our web-app.  Manage employees, access stats, and make critical decisions remotely. </p>
					</div>
				</div>
				<div className="splash-footer-sitemap">

				</div>
			</div>
		)
	}
}

export default Splash;