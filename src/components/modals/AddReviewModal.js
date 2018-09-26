import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { showModal, hideModal } from '../../actions/modals';

const mapDispatchToProps = dispatch => ({
	showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
	hideModal: () => dispatch(hideModal())
})

const mapStateToProps = state => {
	const { token } = state.authReducer
	const { modalType, modalProps } = state.modalReducer
	return { modalType, modalProps, token }
}

class AddReviewModal extends Component {
	
	state = {
		rating: 0,
		review: '',
		inputReceived: false,
	}

	renderRatingMenu = (rating) => {
		return(
			<div className='ratings-bar'>
			{ 	[1,2,3,4,5].map(star => {
					return(
						<div 
							className='star-icon-container' 
							onClick={() =>  this.setState({
												rating: star,
												inputReceived: true,
											})
									}
						>
								<img src={(star <= this.state.rating) ? `/assets/icons/star-full.svg` : `/assets/icons/star-empty.svg`} />
						</div>	
					)
				})
			}
			</div>
		)
	}

	handleRatingSubmission = (itemId) => {
		const { token } = this.props
		const { rating, review } = this.state

		if (!this.state.inputReceived) return console.log("Please input rating")

		return fetch(`/storeItem/ratings/${itemId}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token,			
			},
			method: 'PUT',
			body: JSON.stringify({
				rating,
				review,
			})
		})
		.then(response => response.ok ? response.json() : Promise.reject(response.statusText))
		.then(json => this.props.showModal('ADD_REVIEW_SUCCESS_MODAL', {review, rating, updatedItem: json}))
		.catch(err => console.log(err))
	}

	render(){
		return(
		<div>
			<Modal
				isOpen={this.props.modalType === 'ADD_REVIEW_MODAL'}
				style={modalStyle}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				shouldCloseOnOverlayClick={true}
				onRequestClose={() => this.props.hideModal()}
				>
					<div className='product-review-container'>
						<div className='product-review-image-preview'>
							<img src={this.props.item.imageURL} />
						</div>
						<div className='review-form-container'>
							<h4> {this.props.item.itemName} </h4>
							{ this.renderRatingMenu(this.state.rating) }
							<textarea value={this.state.ratingText} onChange={(e) => this.setState({review: e.target.value})}/>
							<button onClick={() => this.handleRatingSubmission(this.props.item.itemRef_id)}> Submit Rating </button>
							<button onClick={() => this.props.hideModal()}> Cancel </button>
						</div>
					</div>
			</Modal>
		</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddReviewModal)