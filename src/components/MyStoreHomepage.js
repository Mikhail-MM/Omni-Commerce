import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'

class MyStoreHomepage extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<div className='my-store-page-wrapper' >
				<div className='my-store-sidebar-left'>
					<div className='my-store-left-sidebar_button' >
						<Icon className='my-store-left-sidebar_button_icon' name='home' size='huge'/>
						<h5 className='my-store-left-sidebar_button_heading'> Home </h5>
					</div>
					<div className='my-store-left-sidebar_button' >
						<Icon className='my-store-left-sidebar_button_icon' name='mail' size='huge'/>
						<h5 className='my-store-left-sidebar_button_heading'> Messages </h5>					
					</div>

					<div className='my-store-left-sidebar_button my-store-left-sidebar_bottom-button' >
						<Icon className='my-store-left-sidebar_button_icon _last_icon' name='shopping cart' size='huge'/>
						<h5 className='my-store-left-sidebar_button_heading'> My Cart </h5>					
					</div>
					<div className='my-store-left-sidebar_button' >
						<Icon className='my-store-left-sidebar_button_icon' name='cube' size='huge'/>
						<h5 className='my-store-left-sidebar_button_heading'> Manage Stock </h5>					
					</div>
					<div className='my-store-left-sidebar_button' >
						<Icon className='my-store-left-sidebar_button_icon' name='file text outline' size='huge'/>
						<h5 className='my-store-left-sidebar_button_heading'> Purchase Orders </h5>					
					</div>
					<div className='my-store-left-sidebar_button my-store-left-sidebar_bottom-button' >
						<Icon className='my-store-left-sidebar_button_icon _last_icon' name='credit card alternative' size='huge'/>
						<h5 className='my-store-left-sidebar_button_heading'> Payments </h5>					
					</div>

				</div> 
				<div className='my-store-homepage-main-content' >
					<div className='store-main-content-nav-bar' >
					</div>
					<div className='my-store-main-content-border'>
						
					</div>


				</div>
				<div className='my-store-homepage-right-sidebar'>
					<div className='store-modern-menu'>
						<h5>FallJ124's Marketplace</h5>
					</div>
					<div className='store-and-user-avatar' >
						<section className='user-avatar' >

						</section>
						<section className='store avatar' >

						</section>
					</div>
					<div className='shop-stats-container' >
						<h5>Store Stats</h5>
					</div>
					<div className='bottom-menu' >
					</div>
				</div>
			</div>
		)
	}
}

export default MyStoreHomepage