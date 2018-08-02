import React, { Component } from 'react'
import { connect } from 'react-redux'

import EmployeePunchClockFormModal from './modals/EmployeePunchClockFormModal'
import WaiterCallScreenModal from './modals/WaiterCallScreenModal'

import AddTerminalItemModal from './modals/AddTerminalItemModal'
import TransactionHistoryModal  from './modals/TransactionHistoryModal'

import TransactionHistoryModal  from './'

const MODAL_COMPONENTS = {
	'EMPLOYEE_PUNCH_CLOCK_FORM_MODAL': EmployeePunchClockFormModal,
	'ADD_POINT_SALE_ITEM': AddTerminalItemModal,
	'DISPLAY_ALL_TRANSACTIONS': TransactionHistoryModal, 
	'SELECT_EMPLOYEE_OPENING_TICKET': WaiterCallScreenModal, 
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