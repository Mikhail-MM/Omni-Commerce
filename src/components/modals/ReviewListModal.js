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

const ReviewListModal = props => {
	const { reviewArray, arrayType } = props

	const renderRatingIconsToDOM = (rating) => {
		return(
			<div className='ratings-bar'>
				{ 	[1,2,3,4,5].map(star => {
						return(
							<div 
								className='star-icon-container' 
							>
									<img src={(star <= rating) ? `/assets/icons/star-full.svg` : `/assets/icons/star-empty.svg`} />
							</div>	
						)
					})
				}
			</div>
		)
	}

	const renderReviewsToDOM = () => {
		if (reviewArray.length === 0) return <h5> This user has no {arrayType} </h5>
		return reviewArray.map(rating => {
			return(
				<div className='user-social__user-container'>
					<div className='review-userbox-container'>
						<div className='user-social__avatar-container'>
							<img style={{borderRadius:50, border: '.5px solid rgba(0,0,0,0.75)'}} src={rating.avatarURL} />
						</div>
						<div style={{fontSize: '0.75em', margin: '12px'}}> {rating.name} </div>
					</div>
					<div className='user-social__review-container-column'>
						<div className='review-ratings-row'>
							{ renderRatingIconsToDOM(rating.rating) }
						</div>
						<div className='review-contents-container'>
							<p style={{margin: 0, maxWidth: 600, textAlign: 'left'}}> {rating.review} </p>
						</div>
					</div>
				</div>
			)
		})
	}
	return(
		<div>
			<Modal
				isOpen={props.modalType === 'VIEW_REVIEWS_MODAL'}
				style={{...modalStyle, height:'500px', overflow: 'scroll'}}
				contentLabel="Example Modal"
				overlayClassName="Overlay"
				>
				<React.Fragment>
				<div style={{textAlign: 'center', height: 'auto', maxHeight: 600, overflow: 'auto', maxWidth: 600}}>
					<h4> {arrayType} </h4>
					{ renderReviewsToDOM() }
					
				</div>
				<button onClick={() => props.hideModal()}> Cancel </button>
				</React.Fragment>

			</Modal>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewListModal)