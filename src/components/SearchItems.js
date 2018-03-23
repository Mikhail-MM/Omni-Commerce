import React, { Component } from 'react'
import { connect } from 'react-redux'

class SearchItems extends Component {
	constructor(props){
		this.state = {
			searchTerm: ""
		}
		this.handleSearchChange = this.handleSearchChange.bind(this)
	}

	handleSearchChange(event) {
		event.preventDefault()
		this.setState({
			searchTerm: event.target.value
		})
	}

	render() {
		return (
			<div>
				<input type="text" onChange={(e) => handleSearchChange(e)}/>
				<button> Search </button>
			</div>
		)
	}
}

export default connect()(SearchItems)