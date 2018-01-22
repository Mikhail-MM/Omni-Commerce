const mongoose = require('mongoose');
const Schemas = require('../models/schemas/transaction')
const TicketTransaction = Schemas.ticketSchema
const _ = require('underscore')

module.exports.aggregateSalesData = async function(req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	try {

		console.log("Concatenating ALL menuItem arrays to get array of all menu items ordered")

		const allTicketsBySession = await Transaction.find({});
		console.log(AllTicketsBySession)
		const allTicketsByCategory = _.groupBy(allTicketsBySession, 'status')
		const allTicketsByServer = _.groupBy(allTicketsBySession, 'createdBy')
		const allMenuItemsSold = allTicketsBySession
									.map(ticket => ticket.items)
									.reduce((acc, cur) => acc.concat(cur))
		const allMenuItemsSoldByItem = _.groupBy(allMenuItemsSold, 'itemName')
		const allMenuItemsSoldByCategory = _.groupBy(allMenuItemsSold, 'category')


		const data = {
			all_tickets: allTicketsBySession,
			all_tix_by_category: allTicketsByCategory,
			all_tix_by_server: allTicketsByServer,
			all_menu_items_sold: allMenuItemsSold,
			all_menu_items_sold_by_item: allMenuItemsSoldByItem,
			all_menu_items_sold_by_category: allMenuItemsSoldByCategory,
		}
		res.json(data)
		/*
		Total Number of Tickets = length of array
		Gross Sales (Subtotal) = 
		Gross Sales Tax
		Gross Billed (Totals)
		Items Sold by Category: (Use Dat Boi'z Algo)
		Total Number of Items Sold By Item - use GroupBy here and just take .length
		Gross Sales By Menu Item

		
		*/
	} catch(err) { next(err) }
} 