import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal())
})

const mapStateToProps = state => {
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps, }
}

const ReviewSuccessModal = props => {

		return(
		<div>
			<Modal
				isOpen={props.modalType === 'ADD_REVIEW_SUCCESS_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				>
					<div className='review-modal-container'>
						<div>
							<h4> Your Review Was Received Successfully! </h4>
						</div>
					</div>
			</Modal>
		</div>
		)
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewSuccessModal)