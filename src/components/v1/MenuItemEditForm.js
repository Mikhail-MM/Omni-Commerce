import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateMenuItemDetails, fetchMenuItems } from '../actions/menu-items'


function mapStateToProps(state) {
	const { token } = state.authReducer
	const { menuItems, visibleCategory } = state.menuItemsReducer 
	const { activeTicket } = state.ticketTrackingReducer
	return { token, menuItems, visibleCategory, isAuthenticated, activeTicket }
}

class MenuItemEditForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showMenuEditModal: false,
			newItemName: "",
			newItemPrice: "",
			newCategory: "",
		}
	}
/*	

			GENERAL PATTERN !!

function mapStateToProps(state) { 
    const {reduxProvidedArray} = state
    return {reduxProvidedArray}
} 

class DynamicStuff extends Component {
    constructor(props) {
        this.state = {showModal: false}
        this.createDynamicContent= this.createDynamicContent.bind(this)
    }
    createDynamicContent() {
        const {reduxProvidedArray} = this.props
            return reduxProvidedArray.map( item => 
                return <button
                         onClick=        {this.communicateWithDatabase.bind(this, item._id)}> 
                            {item.name} 
                        </button>
                )
    }
    communicateWithDatabase(item_id){ 
        /* I need to use this.setState({showModal: true})
              But I can't because { this } 
         is no longer bound to the parent component 
	
	Should I simply create a popModal() function which is bound to the component and can then use this.setState - can I simply call popModal() from communicateWithDatabase(), or is it still out of scope on account to being .bind()ed to the <button> element?

     }


render(){ 
   return(
    {reduxArray && this.createDynamicContent}
)}}

*/

	render() {
		return(
			<div>
			<h4> You should be able to fetch 
			{menuItems && <h6> Iterate through ALL menu items, }
			{this.state.showMenuEditModal && <form></form>}
			</div>
		)
	}
}