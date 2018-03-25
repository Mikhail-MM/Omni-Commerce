import React, { Component } from 'react'
import { connect } from 'react-redux'

import { initiateSearch, clearSearch } from '../actions/search'

class SearchItems extends Component {
	constructor(props){
		super(props)
		this.state = {
			searchTerm: ""
		}
		this.handleSearchChange = this.handleSearchChange.bind(this)
		this.updateSearchTerm = this.updateSearchTerm.bind(this)
	}

	handleSearchChange(event) {
		event.preventDefault()
		this.setState({
			searchTerm: event.target.value
		})
	}
	
	updateSearchTerm() {
		const { dispatch } = this.props
		if (this.state.searchTerm.trim() === "") return dispatch(clearSearch())
		dispatch(initiateSearch(this.state.searchTerm.trim().toLowerCase()))
	}

	render() {
		return (
			<div className="search-container">
				<input type="text" onChange={(e) => this.handleSearchChange(e)}/>
				<button onClick={this.updateSearchTerm}> Search </button>
			</div>
		)
	}
}

export default connect()(SearchItems)