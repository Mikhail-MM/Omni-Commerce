import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import Modal from 'react-modal';
import { modalStyleOverflow } from '../config';
import { hideModal } from '../../actions/modals';

import { fetchCurrentTicketDetails } from '../../actions/tickets-transactions';

const mapDispatchToProps = (dispatch) => ({
  hideModal: () => dispatch(hideModal()),
  fetchCurrentTicketDetails: (token, ticket_Id) => dispatch(fetchCurrentTicketDetails(token, ticket_Id)),
});

const mapStateToProps = (state) => {
  const { token } = state.authReducer;
  const { tickets, activeTicket } = state.ticketTrackingReducer;
  const { modalType, modalProps } = state.modalReducer;
  return {
    modalType, modalProps, token, tickets, activeTicket,
  };
};

const TransactionHistoryDisplay = (props) => {
  const {
    token,
    tickets,
    activeTicket,
    fetchCurrentTicketDetails,
  } = props;

  const mapTicketsToDOMByStatus = (ticketStatus) => tickets[ticketStatus].map((ticket) => (
    <tr
      key={ticket._id}
      onClick={() => {
        props.hideModal();
        fetchCurrentTicketDetails(token, ticket._id);
      }}
      className="terminal-history-row"
    >
      <td>
        {' '}
        {ticket.status}
        {' '}
      </td>
      <td>
        {' '}
        {ticket.createdBy}
        {' '}
      </td>
      <td>
        {' '}
        {moment(ticket.createdAt).format('h:mm:ss a')}
        {' '}
      </td>
      <td>
        {' '}
$
        {ticket.total}
        {' '}

      </td>
    </tr>
  ));

  const generateTicketStatusMappings = () => Object.keys(tickets).map((ticketStatus) => mapTicketsToDOMByStatus(ticketStatus));

  return (
    <table>
      <thead className="terminal-table-display__header">
        <tr>
          <th> Ticket Status </th>
          <th> Created By </th>
          <th> Time Created </th>
          <th> Total Charge </th>
        </tr>
      </thead>
      <tbody>{tickets && generateTicketStatusMappings()}</tbody>
    </table>
  );
};

const TransactionHistoryModal = (props) => {
  const {
    token,
    tickets,
    activeTicket,
    fetchCurrentTicketDetails,
    hideModal,
  } = props;
  return (
    <div>
      <Modal
        isOpen={props.modalType === 'DISPLAY_ALL_TRANSACTIONS'}
        style={modalStyleOverflow}
        contentLabel="Example Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick
        onRequestClose={() => props.hideModal()}
      >
        <TransactionHistoryDisplay
          token={token}
          tickets={tickets}
          activeTicket={activeTicket}
          fetchCurrentTicketDetails={fetchCurrentTicketDetails}
          hideModal={hideModal}
        />
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransactionHistoryModal);
