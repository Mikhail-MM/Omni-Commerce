// Import Modal Components to Display Here!
import React, { Component } from 'react'
import { connect } from 'react-redux'

import ConfirmCartAdditionModal from './ConfirmCartAdditionModal'
import CartInvalidationModal from './CartInvalidationModal'
import OnlineStoreStripeCheckoutModal from './OnlineStoreStripeCheckoutModal'
import RegistrationConfirmationModal from './RegistrationConfirmationModal'
import AddPointOfSaleItemModal from './AddPointOfSaleItemModal'
import TransactionHistoryModal from './TransactionHistoryModal'
import WaiterCallScreenModal from './WaiterCallScreenModal'
import EmployeePunchClockFormModal from './EmployeePunchClockFormModal'

const MODAL_COMPONENTS = {
	'CONFIRM_CART_ADDITION': ConfirmCartAdditionModal,
	'CART_INVALIDATION': CartInvalidationModal,
	'ONLINE_STORE_STRIPE_CHECKOUT': OnlineStoreStripeCheckoutModal,
	'REGISTRATION_CONFIRMATION_MODAL': RegistrationConfirmationModal,
	'ADD_POINT_SALE_ITEM': AddPointOfSaleItemModal,
	'DISPLAY_ALL_TRANSACTIONS': TransactionHistoryModal,
	'SELECT_EMPLOYEE_OPENING_TICKET': WaiterCallScreenModal,
	'EMPLOYEE_PUNCH_CLOCK_FORM_MODAL': EmployeePunchClockFormModal


}


function mapStateToProps(state) {
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps}
}

class ModalRoot extends Component {
	constructor(props){
		super(props)
		this.state = {}
	}

	render() {
		const { modalType, modalProps } = this.props
		
		if (!modalType) return null
		
		const SpecificModal = MODAL_COMPONENTS[modalType]
		
		return(
			<SpecificModal {...modalProps} />
		) 
	}

}

export default connect(mapStateToProps)(ModalRoot)