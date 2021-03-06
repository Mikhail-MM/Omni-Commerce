import React from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle, modalStylePopIn } from '../config';
import { showModal, hideModal } from '../../actions/modals';

const mapDispatchToProps = (dispatch) => ({
  hideModal: () => dispatch(hideModal()),
  showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
});

const mapStateToProps = (state) => {
  const { modalType, modalProps } = state.modalReducer;
  return { modalType, modalProps };
};

const PaymentTypeSelectionModal = (props) => (
  <div>
    <Modal
      isOpen={props.modalType === 'CASH_OR_CARD_MODAL'}
      style={modalStylePopIn}
      contentLabel="Example Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick
      onRequestClose={() => props.hideModal()}
    >
      <div className="payment-choice-wrapper">
        <div className="payment-section-segment">
          <div
            style={{ width: 100, height: 100 }}
            className="payment-selection-icon"
            onClick={() => props.showModal('CARD_PAYMENT_MODAL', {})}
          >
            <img alt="" src="/assets/icons/credit-card.svg" />
          </div>
          <h5> Debit & Credit </h5>
        </div>
        <div className="payment-section-segment">
          <div
            style={{ width: 100, height: 100 }}
            className="payment-selection-icon"
            onClick={() => props.showModal('CASH_PAYMENT_MODAL', {})}
          >
            <img
              alt=""
              style={{ marginTop: '25px' }}
              src="/assets/icons/change.svg"
            />
          </div>
          <h5> Cash </h5>
        </div>
      </div>
      <button
        className="btn-back-out"
        onClick={() => props.hideModal()}
      >
        {' '}
        Cancel
        {' '}
      </button>
    </Modal>
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentTypeSelectionModal);
