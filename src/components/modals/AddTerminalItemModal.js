import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import ClockInOutForm from './ClockInOutForm'

import { hideModal } from '../../actions/modals'

import { modalStyle } from '../config'

const mapDispatchToProps = (dispatch) => ({
	hideModal: () => dispatch(hideModal())
})

const mapStateToProps = (state) => {
	const { modalType } = state.modalReducer
	return { modalType }
}

const AddTerminalItemModal = props => {
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'ADD_POINT_SALE_ITEM'}
				style={modalStyle}
				contentLabel="Example Modal"
				>

				<AddMenuItemForm />
				<button fluid color='black' onClick={() => this.props.hideModal()}> Cancel </button>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTerminalItemModal)
