import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';


const mapStateToProps = state => {
	const { modalType, modalProps } = state.modalReducer
		return { modalType, modalProps }
}

const mapDispatchToProps = dispatch => ({
	hideModal: () => dispatch(hideModal()),
})

const UserWishlistPreviewPreview = props => {
	const { wishlistArray, arrayType } = props

	const renderWishlistPreviewToDOM = () => {
		if (wishlistArray.length === 0) return <h5> This user's {arrayType} is empty. </h5>
		return wishlistArray.map(item => {
			return(
				<div className='user-wishlist__wishlist-container'>
					<div className='user-wishlist__image-container'>
						<img src={item.imageURL} />
					</div>
					<div className='user-wishlist__metadata-container'>
						<h6> Item Name </h6>
						<h5> {item.itemName} </h5>
						<h6> Posted By </h6>
						<h5> {item.postedBy} </h5>
					</div>
				</div>
			)
		})
	}
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'VIEW_USER_WISHLIST'}
				style={modalStyle}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				>

				<div style={{textAlign: 'center'}}>
					<h4> {arrayType} </h4>
					{ renderWishlistPreviewToDOM() }
					<button onClick={() => props.hideModal()}> Cancel </button>
				</div>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserWishlistPreviewPreview)