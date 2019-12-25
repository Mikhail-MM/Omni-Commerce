import React from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import { fetchAllTicketsAndGenerateSalesReport } from '../../actions/sales-reporting';

const mapStateToProps = (state) => {
  const { modalType, modalProps } = state.modalReducer;
  const { token } = state.authReducer;
  return { token, modalType, modalProps };
};

const mapDispatchToProps = (dispatch) => ({
  closeOutDailySales: (token) => dispatch(fetchAllTicketsAndGenerateSalesReport(token)),
  hideModal: () => dispatch(hideModal()),
});

const ConfirmSalesReportAggregationModal = (props) => (
  <div>
    <Modal
      isOpen={props.modalType === 'CONFIRM_END_OF_BUSINESS_DAY'}
      style={modalStyle}
      contentLabel="Example Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick
      onRequestClose={() => props.hideModal()}
    >
      <div>
        <div>
          <h2> Confirm End of Sales Period </h2>
        </div>
        <div>
          <p>
            This action will collect all transactions within this
            sales period. If you have any open tickets, please ensure
            that they are paid out. All unpaid tickets will be
            considered void.
          </p>
          <p>
            You will not be able to edit these transactions after they
            have been collected without administrative approval.
          </p>
          <button
            onClick={() => props.closeOutDailySales(props.token)}
          >
            {' '}
            Confirm
            {' '}
          </button>
        </div>
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
)(ConfirmSalesReportAggregationModal);
