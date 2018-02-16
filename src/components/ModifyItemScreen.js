import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Divider, Button, Segment } from 'semantic-ui-react'

import { fetchMenuItemByIdToModify } from '../actions/menu-items'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { menuItems } = state.menuItemsReducer

	return { token, menuItems}
}



class ModifyItemScreen extends Component {
	constructor(props) {
		super(props)

	}

	iterateThruCategories() {
		const { menuItems } = this.props
		return Object.keys(menuItems).map(key => {
			return(
				<div>
				<Divider key={key} horizontal> {key} </Divider>
				<Segment key={key} inverted raised>
					{this.iterateThruObject(key)}
				</Segment>
				</div>
			)
		})	
	}

	iterateThruObject(currentKey) {
		const { menuItems, token, dispatch } = this.props
		return menuItems[currentKey].map(item => {
			return(
				<Button 
					key={item.item_id} 
					color="black" 
					onClick={this.handleClickToFetchItemAndOpenModificationModal.bind(this, token, item._id, dispatch)}
				>
						{item.itemName}
				</Button>
			)
		})
	}

	handleClickToFetchItemAndOpenModificationModal(token, item_id, dispatch) {
		dispatch(fetchMenuItemByIdToModify(token, item_id))
	}

	render() {
		const { menuItems } = this.props
		return(
			<div className='modify-item-screen'>
				{ menuItems && this.iterateThruCategories() }
			</div>
		)
	}
}

export default connect(mapStateToProps)(ModifyItemScreen)