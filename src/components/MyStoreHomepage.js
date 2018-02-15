import React, { Component } from 'react'
import { Card, Button, Image, Icon } from 'semantic-ui-react'
import blouseImage from '../assets/marketBlouse.jpg'
class MyStoreHomepage extends Component {
	constructor(props) {
		super(props)
	}

	renderCards() {
		// Placeholder function to mock styling for real data to be retrieved from API
		const cardsArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

		return cardsArray.map(card => {
			return (<div className='cardContainer'>
						<Card>
							<Image src={blouseImage} />
							<Card.Content>
								<Card.Header> Floral Blouse, Black </Card.Header>
								<Card.Meta> In-Stock: 5 </Card.Meta>
								<Card.Description> A classy top that is sure to turn heads! </Card.Description>
								<Card.Header> $ 16.99 </Card.Header>
							</Card.Content>
							<Card.Content extra>
								<Button color='black'> <Icon name='add to cart' /> Add To Cart </Button>
							</Card.Content>
						</Card>
					</div>
					)

		})
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
						{this.renderCards()}
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