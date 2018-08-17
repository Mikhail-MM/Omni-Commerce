/*

The approach towards this component was derived from a post by Redux Author Dan Abramov on StackOverflow seen here:

By abstracting the state of which Modal Type needs to be displayed away from conditional rendering from JSX into redux, programatically managing
a modal-heavy application becomes trivial. The approach is seen here:

https://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions

An even more involved approach can be seen here, authored by Redux maintainer Mark Erikson:

https://blog.isquaredsoftware.com/2017/07/practical-redux-part-10-managing-modals/

*/

import React, { Component } from 'react'
import { connect } from 'react-redux'

import EmployeePunchClockFormModal from './modals/EmployeePunchClockFormModal'
import WaiterCallScreenModal from './modals/WaiterCallScreenModal'

import AddTerminalItemModal from './modals/AddTerminalItemModal'
import TransactionHistoryModal  from './modals/TransactionHistoryModal'

import EssosCardPaymentModal from './modals/EssosCardPaymentModal'
import CashPaymentModal  from './modals/CashPaymentModal'
import CardPaymentModal from './modals/CardPaymentModal'

import CustomAddonModal from './modals/CustomAddonModal'

import ConfirmCartModal from './modals/ConfirmCartModal'
import CartSuccessModal from './modals/CartSuccessModal'
import CartInvalidationModal from './modals/CartInvalidationModal'

import ConfirmSalesReportAggregationModal from './modals/ConfirmSalesReportAggregationModal'

import PaymentTypeSelectionModal from './modals/PaymentTypeSelectionModal'

import DatabaseInterfaceModal from './modals/DatabaseInterfaceModal'
import UploadSuccessModal from './modals/UploadSuccessModal'

import AuthenticationForm from './forms/registration/AuthenticationForm'


const MODAL_COMPONENTS = {
	'EMPLOYEE_PUNCH_CLOCK_FORM_MODAL': EmployeePunchClockFormModal,
	'ADD_POINT_SALE_ITEM': AddTerminalItemModal,
	'DISPLAY_ALL_TRANSACTIONS': TransactionHistoryModal, 
	'SELECT_EMPLOYEE_OPENING_TICKET': WaiterCallScreenModal, 

	'CASH_PAYMENT_MODAL': CashPaymentModal, // Gets CashPaymentForm
	'CARD_PAYMENT_MODAL': CardPaymentModal, // Gets Checkout
	'CUSTOM_ADDON_MODAL': CustomAddonModal,

	'ADD_EMPLOYEE_MODAL': AuthenticationForm,

	
	'CONFIRM_END_OF_BUSINESS_DAY': ConfirmSalesReportAggregationModal,
	'CONFIRM_CART_ADDITION': ConfirmCartModal,
	'CART_ADDITION_SUCCESS_MODAL': CartSuccessModal,
	'CART_INVALIDATION_MODAL': CartInvalidationModal,
	'ONLINE_STORE_STRIPE_CHECKOUT': EssosCardPaymentModal,

	'CASH_OR_CARD_MODAL': PaymentTypeSelectionModal,

	'DATABASE_INTERFACE_MODAL': DatabaseInterfaceModal,
	'SHOW_ITEM_UPLOAD_SUCCESS_MODAL': UploadSuccessModal,
}


const mapStateToProps = (state) => {
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