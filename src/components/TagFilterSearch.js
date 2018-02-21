import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Checkbox, Form } from 'semantic-ui-react'
const allTags = ["Clothes", "Mens", "Womens", "Tops", "Bottoms", "Accessories", "Shoes", "Art", "Computers", "Electronics", "Appliances", "Cars", "Motorcycles", "Furniture"]

class TagFilterSearch extends Component {
	constructor(props) {
		super(props)
		this.state = {
			Clothes: false,
			Mens: false,
			Womens: false,
			Tops: false,
			Bottoms: false,
			Accessories: false,
			Shoes: false,
			Art: false,
			Computers: false,
			Electronics: false,
			Appliances: false,
			Cars: false,
			Motorcycles: false,
			Furniture: false,
			selected: []
		}
		this.generateCheckboxInputs = this.generateCheckboxInputs.bind(this)
		this.handleTagChange = this.handleTagChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	generateCheckboxInputs() {
		return allTags.map(tag => {
			console.log(this.state[tag])
			return <Checkbox color="white" label={tag} checked={this.state[tag] === true } onChange={() => this.handleTagChange(tag)} />
		})
	}

	handleTagChange(tagName){
		this.setState({
			[tagName]: !this.state[tagName]
		})

		if (!this.state.selected.includes(tagName)) {
			this.setState({
				selected: this.state.selected.concat([tagName])	
			})
		}
		if (this.state.selected.includes(tagName)) {
			this.setState({
				selected: this.state.selected.filter(item => item !== tagName)
			})
		}
		
	}

	handleSubmit(event) {
		event.preventDefault()
		console.log("Query all items for { $and: [{tags: 'selected[1]'}] }...basically build the query!")
		console.log(this.state.selected)


	}

	render() {
		return(
			<div className="checkboxFormContainer" >

				{this.generateCheckboxInputs()}
			</div>
		)
	}
}

export default connect()(TagFilterSearch)