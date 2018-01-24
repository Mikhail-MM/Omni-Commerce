const mongoose = require('mongoose');
const Schemas = require('../models/schemas/transaction')
const TicketTransaction = Schemas.ticketSchema
const BigNumber = require('bignumber.js')
const _ = require('underscore')

module.exports.aggregateSalesData = async function(req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	try {

		console.log("Concatenating ALL menuItem arrays to get array of all menu items ordered")

		const allTicketsBySession = await Transaction.find({});
		console.log(allTicketsBySession)
		const allTicketsByCategory = _.groupBy(allTicketsBySession, 'status')
		const allTicketsByServer = _.groupBy(allTicketsBySession, 'createdBy')
		const allMenuItemsSold = allTicketsBySession
									.map(ticket => ticket.items)
									.reduce((acc, cur) => acc.concat(cur))
		const allMenuItemsSoldByItem = _.groupBy(allMenuItemsSold, 'itemName')
		const allMenuItemsSoldKeys = Object.keys(allMenuItemsSoldByItem);
		const grossSalesByMenuItemObject = {}
		const grossSalesByMenuItemArray = allMenuItemsSoldKeys.map(key => allMenuItemsSoldByItem[key]
																		.map(arrayOfSoldMenuItemsInCategory => new BigNumber(arrayOfSoldMenuItemsInCategory.itemPrice))
																		.reduce((acc, cur) => acc.plus(cur))); // creates an array instead of an object
		const menuItemsGross = Object.keys(allMenuItemsSoldByItem).forEach(key => grossSalesByMenuItemObject[key] = allMenuItemsSoldByItem[key]
																		.map(arrayOfSoldMenuItemsInCategory => new BigNumber(arrayOfSoldMenuItemsInCategory.itemPrice))
																		.reduce((acc, cur) => acc.plus(cur)).toNumber()) // mutates allMenuItemsSoldByItem



		const allMenuItemsSoldByCategory = _.groupBy(allMenuItemsSold, 'category')

		const grossSales = allTicketsBySession
						   	.map(ticket => new BigNumber(ticket.totalReal))
						   	.reduce((acc, cur) => acc.plus(cur)).toNumber()


		const data = { // take out snake_case
			all_tickets: allTicketsBySession,
			all_tix_by_category: allTicketsByCategory,
			all_tix_by_server: allTicketsByServer,
			all_menu_items_sold: allMenuItemsSold,
			all_menu_items_sold_by_item: allMenuItemsSoldByItem,
			all_menu_items_sold_by_category: allMenuItemsSoldByCategory,
			gross_sales: grossSales,
			gross_sale_by_menu_item_array: grossSalesByMenuItemArray,
			gross_sales_by_menu_item: grossSalesByMenuItemObject,
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