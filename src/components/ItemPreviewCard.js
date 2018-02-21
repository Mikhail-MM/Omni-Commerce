import React, { Component } from 'react'

import { Card, Button } from 'semantic-ui-react'

class ItemPreviewCard extends Component {
	constructor(props){
		super(props)
	}
	componentDidMount(){
		console.log(this.props)
	}
	render() {
		return(
			<div> Item added successfully </div>
		)
	}
}

export default ItemPreviewCard;