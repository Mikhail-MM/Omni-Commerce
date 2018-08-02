import React, { Component } from 'react'
import { connect } from 'react-redux'

import EmployeePunchClockFormModal from './modals/EmployeePunchClockFormModal'
import AddTerminalItemModal from './modals/AddTerminalItemModal'

const MODAL_COMPONENTS = {
	'EMPLOYEE_PUNCH_CLOCK_FORM_MODAL': EmployeePunchClockFormModal,
	'ADD_POINT_SALE_ITEM': AddTerminalItemModal,
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