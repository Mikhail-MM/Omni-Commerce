const mongoose = require('mongoose');
const Schemas = require('../models/schemas/transaction')
const TicketTransaction = Schemas.ticketSchema
const _ = require('underscore')

module.exports.aggregateSalesData = async function(req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	try {

		console.log("Concatenating ALL menuItem arrays to get array of all menu items ordered")

		const AllTicketsBySession = await Transaction.find({});
		console.log(AllTicketsBySession)
		const AllTicketsByCategory = _.groupBy(AllTicketsBySession, 'status')
		const AllMenuItemsSold = AllTicketsBySession
									.map(ticket => ticket.items)
									.reduce((acc, cur) => acc.concat(cur))
		const AllMenuItemsSoldByItem = _.groupBy(AllMenuItemsSold, 'itemName')
		const AllMenuItemsSoldByCategory = _.groupBy(AllMenuItemsSold, 'category')

		const data = {
			all_tickets: AllTicketsBySession,
			all_tix_by_category: AllTicketsByCategory,
			all_menu_items_sold: AllMenuItemsSold,
			all_menu_items_sold_by_item: AllMenuItemsSoldByItem,
			all_menu_items_sold_by_category: AllMenuItemsSoldByCategory,
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