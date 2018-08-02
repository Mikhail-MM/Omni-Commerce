import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

const CustomAddonModal = props => {
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'CUSTOM_ADDON_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				>

				<AddTerminalItemForm />
				<button color='black' onClick={() => this.props.hideModal()}> Cancel </button>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomAddonModal)