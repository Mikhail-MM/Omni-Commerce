import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../styles/TerminalActionScreen.css';

import ModalRoot from '../ModalRoot';
import { showModal } from '../../actions/modals';
import { routeToNode } from '../../actions/routing';
import { fetchMenuItems } from '../../actions/terminalItems';
import {
  fetchCurrentTicketDetails,
  setVisibleCategory,
  updateTransactionWithMenuItem,
  updateTicketStatus,
  updateTransactionWithSubdocRemoval,
} from '../../actions/tickets-transactions';

const mapStateToProps = (state, ownprops) => {
  const { token, isAuthenticated } = state.authReducer;
  const { menuItems, visibleCategory } = state.terminalItemsReducer;
  const { activeTicket } = state.ticketTrackingReducer;

  return {
    token,
    menuItems,
    visibleCategory,
    isAuthenticated,
    activeTicket,
  };
};

const mapDispatchToProps = (dispatch) => ({
  showModal: (modalType, modalProps) =>
    dispatch(showModal(modalType, modalProps)),
  setVisibleCategory: (category) =>
    dispatch(setVisibleCategory(category)),
  updateTransactionWithMenuItem: (token, itemId, ticketId) =>
    dispatch(updateTransactionWithMenuItem(token, itemId, ticketId)),
  updateTicketStatus: (token, ticketId, status) =>
    dispatch(updateTicketStatus(token, ticketId, status)),
  removeItemFromTicket: (token, subdocId, ticketId) =>
    dispatch(
      updateTransactionWithSubdocRemoval(token, subdocId, ticketId),
    ),
  routeToNode: (node) => dispatch(routeToNode(node)),
  fetchCurrentTicketDetails: (token, ticketId) =>
    dispatch(fetchCurrentTicketDetails(token, ticketId)),
  fetchMenuItems: (token) => dispatch(fetchMenuItems(token)),
});

class TerminalActionScreen extends Component {
  state = {};

  // Category Selection Screen

  componentDidMount() {
    const { token } = this.props;
    this.props.fetchCurrentTicketDetails(
      token,
      this.props.match.params.id,
    );
    this.props.fetchMenuItems(token);
  }

  componentDidUpdate(prevProps) {
    const { token } = this.props;
    if (
      this.props.isAuthenticated === !prevProps.isAuthenticated &&
      this.props.isAuthenticated
    ) {
      this.props.fetchCurrentTicketDetails(
        token,
        this.props.match.params.id,
      );
      this.props.fetchMenuItems(token);
    }
  }

  generateItemCategoryVisibilityMenu = () => {
    const { menuItems, visibleCategory } = this.props;

    const darkPastelColorWheel = [
      '#3D1D1D',
      '#311726',
      '#3D2B1D',
      '#3D1D1D',
    ];

    return Object.keys(menuItems).map((category, index) => {
      return (
        <button
          className="ripple-btn ripple terminal-category-buttons"
          style={{
            backgroundColor: `${
              category === visibleCategory
                ? '#2F99F2'
                : 'rgb(66, 64, 244)'
            }`,
            marginRight: 4,
            borderStyle: 'none',
            color: 'white',
            cursor: 'pointer',
          }}
          key={category}
          onClick={() => this.props.setVisibleCategory(category)}
        >
          {category}
        </button>
      );
    });
  };

  // Button Containers - Set to be Hidden or Visible by CSS Class

  generateCategoryContainersByVisibility = () => {
    const { menuItems, visibleCategory } = this.props;

    return Object.keys(menuItems).map((category) => {
      const classCheck =
        visibleCategory == category ? 'Show' : 'Hide';

      return (
        <div
          key={category}
          className={`${classCheck} ${category} touchpad-subcategory`}
        >
          {' '}
          {this.mapTerminalItemsToDOM(category)}{' '}
        </div>
      );
    });
  };

  // Menu Buttons

  mapTerminalItemsToDOM = (category) => {
    const { token, menuItems, activeTicket } = this.props;

    return menuItems[category].map((item) => {
      return (
        <div
          className="ui-pos-item ui-pos-ripple"
          key={item._id}
          onClick={() => {
            if (this.props.modify)
              this.props.showModal('DATABASE_INTERFACE_MODAL', {
                module: 'Omni',
                action: 'modify',
                modifyItemAttributes: item,
              });
            else if (!this.props.modify)
              this.props.updateTransactionWithMenuItem(
                token,
                item._id,
                activeTicket._id,
              );
          }}
        >
          <div className="ui-pos-item_image">
            <img alt="" src={item.imageURL} />
          </div>
          <div className="ui-pos-item_content">
            <div
              className="ui-pos-item-name"
              style={
                item.itemName.length > 20
                  ? { marginTop: '2px', fontSize: '0.7em' }
                  : { marginTop: '2px' }
              }
            >
              {item.itemName}
            </div>
            <div className="ui-pos-item-price">{item.itemPrice}</div>
          </div>
        </div>
      );
    });
  };

  // Ledger Rendering

  generateLedgerFromActiveTicket = () => {
    const { activeTicket, token } = this.props;

    return activeTicket.items.map((item, index, array) => {
      return (
        <tr
          key={item._id}
          className={`ledger-row${
            index === array.length - 1 ? ' fade-in-row' : ''
          }`}
        >
          <td>{item.itemName}</td>
          <td>${item.itemPrice}</td>
          <td>
            {index === array.length - 1 ? (
              <img
                alt=""
                style={{ height: 24, width: 24, cursor: 'pointer' }}
                src={'/assets/icons/greenplus.svg'}
                onClick={() =>
                  this.props.showModal('CUSTOM_ADDON_MODAL', {})
                }
              />
            ) : null}
          </td>
          <td>
            <img
              alt=""
              style={{ height: 24, width: 24, cursor: 'pointer' }}
              src={'/assets/icons/close.svg'}
              onClick={() =>
                this.props.removeItemFromTicket(
                  token,
                  item._id,
                  activeTicket._id,
                )
              }
            />
          </td>
        </tr>
      );
    });
  };

  displayPricingFromActiveTicket = () => {
    const { activeTicket, menuItems } = this.props;

    return (
      <div className="pricing-container">
        <div
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <span> Subtotal: </span>
          <span>{`$${activeTicket.subTotal}`} </span>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <span> Tax: </span>
          <span>{`$${activeTicket.tax}`} </span>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <span> Total: </span>
          <span>{`$${activeTicket.total}`} </span>
        </div>
      </div>
    );
  };

  render() {
    const {
      token,
      isAuthenticated,
      menuItems,
      visibleCategory,
      activeTicket,
    } = this.props;
    return (
      <div className="action-page-wrapper">
        <ModalRoot />

        <div className="app-header__terminal-action">
          <div
            style={{ width: 60, height: 60, cursor: 'pointer' }}
            onClick={() => this.props.routeToNode('/')}
          >
            <img alt="" src={'/assets/TRANSLOGOthin.svg'} />
          </div>
        </div>

        <div className="main-action-wrapper">
          <div className="picker-column">
            <div className="touchpad">
              {menuItems &&
                this.generateCategoryContainersByVisibility()}
            </div>

            <div className="category-selection-buttons">
              {menuItems && this.generateItemCategoryVisibilityMenu()}
            </div>
          </div>

          {/* Need to switch classNames from DIVS to the Table elements */}
          <div className="ledger">
            <div className="table-container">
              <table className="ledger-table">
                <thead className="ledger-table__header">
                  <tr>
                    <td> Item Name </td>
                    <td> Price </td>
                    <td> Add-On </td>
                    <td> Remove </td>
                  </tr>
                </thead>
                <tbody className="ledger-tbody">
                  {activeTicket &&
                    this.generateLedgerFromActiveTicket()}
                </tbody>
              </table>
            </div>
            <div className="ledger-footer">
              <div className="footer-buttons-pricing">
                <div className="action-button-container">
                  <div
                    className="action-button active-btn"
                    onClick={() =>
                      this.props.updateTicketStatus(
                        token,
                        activeTicket._id,
                        'Active',
                      )
                    }
                  >
                    Fire Order
                  </div>
                  <div
                    className="action-button void-btn"
                    onClick={() =>
                      this.props.updateTicketStatus(
                        token,
                        activeTicket._id,
                        'Void',
                      )
                    }
                  >
                    Void Ticket
                  </div>
                </div>
                <div>
                  {' '}
                  Ticket Status
                  {activeTicket && `: ${activeTicket.status}`}
                </div>
                {activeTicket &&
                  this.displayPricingFromActiveTicket()}
              </div>

              <button
                className="checkout-button ripple-btn"
                onClick={() =>
                  this.props.showModal('CASH_OR_CARD_MODAL', {})
                }
              >
                Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TerminalActionScreen);
