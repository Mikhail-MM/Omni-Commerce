import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Checkbox, Form, Button } from 'semantic-ui-react'
const allTags = ["Clothes", "Mens", "Womens", "Tops", "Bottoms", "Accessories", "Shoes", "Art", "Computers", "Electronics", "Appliances", "Cars", "Motorcycles", "Furniture"]

function mapStateToProps(state) {
	const { marketplaceItems } = state.marketplaceItemsReducer
	return { marketplaceItems }
} 

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
		this.filterStoredItems = this.filterStoredItems.bind(this)
	}

	generateCheckboxInputs() {
		return allTags.map(tag => {
			console.log(this.state[tag])
			return <Checkbox color="white" label={tag} checked={this.state[tag] === true } onChange={() => this.handleTagChange(tag)} />
		})
	}

	handleTagChange(tagName){
		// We need to create a global reducer/action to load active filters into redux state
		// So new items will be filtered by tag when navigating between stores
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


	filterStoredItems(filter) {
		const { marketplaceItems } = this.props
		console.log(filter)



	}

	render() {
		return(
			<div className="checkboxFormContainer" >
				{this.generateCheckboxInputs()}
				<Button onClick={ () => this.filterStoredItems(this.state.selected)}>Filter Items </Button>
			</div>
		)
	}
}

export default connect(mapStateToProps)(TagFilterSearch)