import React, { Component } from 'react'

export default class CardMockup extends Component {
	constructor(props){
		super(props)
	}

	render() {
		return(
			<div className="dynamic_cards">
			<div className="ui_card_mockup">
				<div className="ui_card_image">
					<img style={{ width: '100%', height: 'auto', maxHeight: 400, borderRadius: '5px 5px 0px 0px'}} src={'/assets/mirror.jpg'} />
				</div>
				<div className="ui_card_content" >
					<p> Mirror </p>
					<p> $ 300 </p>
					<p> 1 in stock </p>
				</div>
			</div>
			<div className="ui_card_mockup">
				<div className="ui_card_image">
					<img style={{ objectFit: 'cover', maxHeight: '100%', maxWidth: '100%', borderRadius: '5px 5px 0px 0px'}} src={'/assets/reccords.jpg'} />
				</div>
				<div className="ui_card_content" >
					<p> Vintage Records </p>
					<p> $ 9.99 </p>
					<p> 300 in stock </p>
				</div>
			</div>
			</div>
		)
	}
} 