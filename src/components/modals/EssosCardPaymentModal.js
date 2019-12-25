import React from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import Checkout from '../stripe/Checkout';

const mapStateToProps = (state) => {
  const { modalType, modalProps } = state.modalReducer;
  return { modalType, modalProps };
};
const mapDispatchToProps = (dispatch) => ({
  hideModal: () => dispatch(hideModal()),
});

const EssosCardPaymentModal = (props) => (
  <div>
    <Modal
      isOpen={props.modalType === 'ONLINE_STORE_STRIPE_CHECKOUT'}
      style={modalStyle}
      contentLabel="Example Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick
      onRequestClose={() => props.hideModal()}
    >
      <div style={{ height: 100, width: 700 }}>
        <Checkout apiStripePath="Essos" />
        <button
          className="btn-back-out"
          onClick={() => props.hideModal()}
        >
          {' '}
          Cancel
          {' '}
        </button>
      </div>
    </Modal>
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EssosCardPaymentModal);
