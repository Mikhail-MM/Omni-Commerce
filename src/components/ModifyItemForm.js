import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Form, Segment } from 'semantic-ui-react'

import { updateMenuItemProperties } from '../actions/menu-items'

function mapStateToProps(state) {
	const { token } = state.authReducer;
	const { itemInFocus } = state.menuItemsReducer;

	return { token, itemInFocus }
}

class ModifyItemForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			itemName: '',
			itemPrice: '',
			category: ''
		}
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount() {
		const { itemInFocus } = this.props

		this.setState({
			itemName: itemInFocus.itemName,
			itemPrice: itemInFocus.itemPrice,
			category: itemInFocus.category,
		})
	}

	handleChange(input, value) {
		this.setState({
			[input]: value
		})
	}

	handleSubmit() {
		const { token, itemInFocus, dispatch } = this.props
		console.log(itemInFocus)
		console.log(itemInFocus._id)
		dispatch(updateMenuItemProperties(token, itemInFocus._id, this.state))

	}

	render(){
		const { itemInFocus } = this.props
		return(
			<Segment raised inverted>
				{ itemInFocus &&
				<Form onSubmit={this.handleSubmit}>
					<Form.Input
						fluid
						placeholder='Item Name'
						type='text'
						value={this.state.itemName} 
						onChange={e => this.handleChange('itemName', e.target.value)}
					/>
					<Form.Input
						fluid
						placeholder='Item Price'
						type='text'
						value={this.state.itemPrice} 
						onChange={e => this.handleChange('itemPrice', e.target.value)}
					/>
					<Form.Input
						fluid
						placeholder='Category'
						type='text'
						value={this.state.category} 
						onChange={e => this.handleChange('category', e.target.value)}
					/>
					<Form.Button fluid size='large' content='Submit'>Modify items</Form.Button>
				</Form>
				}
			</Segment>
		)
	}
}

export default connect(mapStateToProps)(ModifyItemForm)