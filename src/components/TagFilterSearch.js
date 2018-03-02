import React, { Component } from 'react'
import { connect } from 'react-redux'

import { filterStoreResults } from '../actions/filter'

import { Checkbox, Form, Button, Label } from 'semantic-ui-react'
const allTags = ["Clothes", "Mens", "Womens", "Tops", "Bottoms", "Accessories", "Shoes", "Art", "Computers", "Electronics", "Appliances", "Cameras", "Cars", "Motorcycles", "Furniture"]

function mapStateToProps(state) {
	const { marketplaceItems } = state.marketplaceItemsReducer
	const filter = state.marketplaceFilterReducer
	return { marketplaceItems, filter }
} 

class TagFilterSearch extends Component {
	constructor(props) {
		super(props)
		this.generateFilter = this.generateFilter.bind(this)
		this.handleTagChange = this.handleTagChange.bind(this)
	}

	generateFilter() {
		
		const { filter } = this.props

		return allTags.map(tag => {
			if (!filter.selected.includes(tag)) return <Label style={{width: 85, marginTop: 5}} onClick={ () => this.handleTagChange(tag) }> {tag} </Label>
			else if (filter.selected.includes(tag)) return <Label style={{width: 85, marginTop: 5}} color='red' onClick={ () => this.handleTagChange(tag) }> {tag} </Label>
		})

	}

	handleTagChange(tagName){

		const { dispatch } = this.props;
		
			dispatch(filterStoreResults(tagName))
		
	}




	render() {
		return(
			<div className="filter-container">
				{this.generateFilter()}
			</div>
		)
	}
}

export default connect(mapStateToProps)(TagFilterSearch)