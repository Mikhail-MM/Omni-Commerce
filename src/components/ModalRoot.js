// Import Modal Components to Display Here!
import React, { Component } from 'react'
import { connect } from 'react-redux'

import ExampleModal from './ExampleModal'
import ConfirmCartAdditionModal from './ConfirmCartAdditionModal'
import CartInvalidationModal from './CartInvalidationModal'
import OnlineStoreSTripeCheckoutModal from './OnlineStoreStripeCheckoutModal'

import CART_INVALIDATION
const MODAL_COMPONENTS = {
	'EXAMPLE_MODAL': ExampleModal,
	'CONFIRM_CART_ADDITION': ConfirmCartAdditionModal,
	'CART_INVALIDATION': CartInvalidationModal,
	'ONLINE_STORE_STRIPE_CHECKOUT': OnlineStoreStripeCheckoutModal,

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