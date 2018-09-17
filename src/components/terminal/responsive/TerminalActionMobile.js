import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import ModalRoot from '../../ModalRoot'
import { showModal } from '../../../actions/modals'
import { routeToNode } from '../../../actions/routing'
import { 
	setVisibleCategory, 
	updateTransactionWithMenuItem, 
	updateTicketStatus, 
	updateTransactionWithSubdocRemoval 
} from '../../../actions/tickets-transactions'

import '../../styles/TerminalActionScreen.css'

const mapStateToProps = (state, ownprops) => {
	const { token, isAuthenticated } = state.authReducer
	const { menuItems, visibleCategory } = state.terminalItemsReducer 
	const { tickets, activeTicket } = state.ticketTrackingReducer
		return { token, menuItems, visibleCategory, isAuthenticated, tickets, activeTicket }
}

const mapDispatchToProps = dispatch => ({
	showModal: 						(modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
	setVisibleCategory: 			(category) => dispatch(setVisibleCategory(category)),
	updateTransactionWithMenuItem: 	(token, itemId, ticketId) => dispatch(updateTransactionWithMenuItem(token, itemId, ticketId)),
	updateTicketStatus: 			(token, ticketId, status) => dispatch(updateTicketStatus(token, ticketId, status)),
	removeItemFromTicket: 			(token, subdocId, ticketId) => dispatch(updateTransactionWithSubdocRemoval(token, subdocId, ticketId)),
	routeToNode: 					(node) => dispatch(routeToNode(node)),
})

class TerminalActionMobile extends Component {
	state = {
		showSidebar: false,
		mainContent: 'ledger',
		sidebarContent: 'category'
	}
	

	renderSidebarBody = (sidebarViewState) => {
		if (sidebarViewState === 'category') 	return this.renderItemCategorySelectionButtons()
		if (sidebarViewState === 'items') 		return this.buildItemSelectionMenu()
		if (sidebarViewState === 'tickets')		return this.buildTicketSelectionMenu()
	}
	
	renderItemCategorySelectionButtons = () => {
		const { menuItems, visibleCategory } = this.props
			return Object.keys(menuItems).map((category, index) => {
				return <button 
							style={{
								backgroundColor: `${(category === visibleCategory) ? '#2F99F2' : 'rgb(66, 64, 244)'}`,
								marginRight: 4,
								borderStyle: 'none',
								color: 'white',
								cursor: 'pointer'

							}} 
							key={category} 
							onClick={() => {
								this.props.setVisibleCategory(category)
								this.setState({
									sidebarContent: 'items'
								})
							}}
						> 
							{category} 
						</button>
			})
	}

	buildItemSelectionMenu = () => {
		const { menuItems, visibleCategory } = this.props
			return Object.keys(menuItems).map(category => {
				if (category === visibleCategory) return <div key={category} className={`${category} touchpad-subcategory`}> {this.mapTerminalItemsToDOM(category)} </div> 
			})
	}

	mapTerminalItemsToDOM = category => {
		const { token, menuItems, activeTicket } = this.props

		return menuItems[category].map(item => {
			return(
  				<div 
  					className="ui-pos-item" key={item._id} 
  					onClick={ () => {
  						if ( this.props.modify ) this.props.showModal('DATABASE_INTERFACE_MODAL', { module: 'Omni', action: 'modify', modifyItemAttributes: item })
  						else if ( !this.props.modify ) this.props.updateTransactionWithMenuItem(token, item._id, activeTicket._id)
  						}
  					}
  				>
  					<div className="ui-pos-item_image">
  						<img src={item.imageURL} />
  					</div>
  					<div className="ui-pos-item_content">
  						<div className="ui-pos-item-name" style={(item.itemName.length > 20) ? {'marginTop': '2px','fontSize': '0.7em'} : {'marginTop': '2px'} }>
							{item.itemName}
  						</div>
  						<div className="ui-pos-item-price">
  							{item.itemPrice}
  						</div>
  					</div>
				</div>				
			)
		})
	}


	buildTicketSelectionMenu = () => {
		const { tickets } = this.props
		return(
			<table>
				<thead>
					<tr>
						<th> Ticket Status </th>
						<th> Created By </th>
						<th> Time Created </th>
						<th> Total Charge </th>
					</tr>
				</thead>
				<tbody>
					{ tickets && this.generateTicketStatusMappings() }
				</tbody>
			</table>
		)
	}

	generateTicketStatusMappings = () => {
		const { tickets } = this.props
		return( Object.keys(tickets).map(ticketStatus => {
			return( this.mapTicketsToDOMByStatus(ticketStatus) )
		}))
	}

	mapTicketsToDOMByStatus = ticketStatus => {
		const { activeTicket, tickets, token } = this.props
		return tickets[ticketStatus].map(ticket => {
			return(
				<tr 
					key={ticket._id} 
					onClick={() => {
						this.props.hideModal()
						this.props.fetchCurrentTicketDetails(token, ticket._id)}
					}
					style={(ticket._id === activeTicket._id) ? {backgroundColor:'rgba(24,123,123,0.25)'} : {}}
				>
					<td> {ticket.status} </td>
					<td> {ticket.createdBy} </td>
					<td> {moment(ticket.createdAt).format('h:mm:ss a')} </td>
					<td> $ {ticket.total} </td>
				</tr>
			)
		})
	}

	generateLedgerFromActiveTicket = () => {
		const { activeTicket, token } = this.props

		return activeTicket.items.map((item, index, array) => {

			return(
					<tr key={item._id} className={`ledger-row${(index === array.length - 1) ? ' fade-in-row' : ''}`}>
						<td>{item.itemName}</td>
						<td>${item.itemPrice}</td>
						<td>{ (index === array.length - 1) ? <button  onClick={() => this.props.showModal('CUSTOM_ADDON_MODAL', {})}>AddOn</button> : null }</td>
						<td><button  onClick={() => this.props.removeItemFromTicket(token, item._id, activeTicket._id)}>Remove</button></td>	 
					</tr>
			)

		})
	}

	displayPricingFromActiveTicket = () => {
		const { activeTicket, menuItems } = this.props

		return(
			<div className='pricing-container'>
				<div> {`SubTotal: ${activeTicket.subTotal}`} </div>
				<div> {`Tax: ${activeTicket.tax}`} </div>
				<div> {`Total: ${activeTicket.total}`} </div>
			</div>
		)
	}

	render() {
		const { activeTicket, token } = this.props
		return (
				<div className='mobile-action-wrapper'>
					<ModalRoot />
					<div className={`mobile-action-sidebar${(this.state.showSidebar) ? ' activeSidebarMenu' : ''}`} >
						<div 
							className='mobile-action-sidebar__header'
						>

							<button 
								onClick={() => {
									this.setState({
										sidebarContent: 'category'
									})
								}}
							>
								Back to Categories
							</button>
							<button onClick={() => this.setState(prevState => ({
								showSidebar: !prevState.showSidebar
							}))}
							>
								Back
							</button>

						</div>
						<div className='mobile-action-sidebar__body'>
							{
								this.renderSidebarBody(this.state.sidebarContent)
							}
						</div>
					</div>
					<div className='mobile-action__header'>
						Mobile Layout Wireframe
					</div>
					<div className='mobile-action__body'>
						<div className='mobile-action__body__table-container'>
							<table className='ledger-table'>
								<thead className='ledger-table__header'>
									<tr>
										<td> Item Name </td>
										<td> Price </td>
										<td> Add-On </td>
										<td> Remove </td>
									</tr>
								</thead>
								<tbody className='ledger-tbody'>
									{ activeTicket && this.generateLedgerFromActiveTicket() }
								</tbody>
							</table>
						</div>
						<div className='mobile-action__body__tfooter-action-container'>
							<div className='footer-buttons-pricing'>
								<div className='action-button-container'>
									<div 
										style={{ backgroundColor: '#463FC5', marginBottom: 10 }} 
										className='action-button'
										 onClick={() => this.props.updateTicketStatus(token, activeTicket._id, "Active")}
									> 
										Fire Order 
									</div>
									<div 
										style={{ backgroundColor: '#8E2727' }} 
										className='action-button'
										onClick={() => this.props.updateTicketStatus(token, activeTicket._id, "Void")}
									> 
										Void Ticket 
									</div>
								</div>
								<div> Ticket Status{(activeTicket) && `: ${activeTicket.status}`}</div>
								{ activeTicket && this.displayPricingFromActiveTicket() }
							
							</div>

							<div className='checkout-button' onClick={() => this.props.showModal('CASH_OR_CARD_MODAL', {})}>
								Payment
							</div>
						</div>
					</div>
					<div className='mobile-action__footer-navigation'>
						<button 
							className='mobile-action__navigation-button'
							onClick={() => this.setState({
								showSidebar: true,
								sidebarContent: 'category'
							})}
						>
							Add Item
						</button>
						<button 
							className='mobile-action__navigation-button'
							onClick={() => this.setState({
								showSidebar: true,
								sidebarContent: 'tickets'
							})}
						>
							See Tickets
						</button>
					</div>
				</div>
		)

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TerminalActionMobile)