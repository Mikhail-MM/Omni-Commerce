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
		const allMenuItemsSoldByCategory = _.groupBy(allMenuItemsSold, 'category')
		const allMenuItemsSoldKeys = Object.keys(allMenuItemsSoldByItem);
		const grossSalesByMenuItemObject = {}
		const grossSalesByServer = {}
		const grossSalesByMenuItemCategory = {}
		/*
		const grossSalesByMenuItemArray = allMenuItemsSoldKeys.map(key => allMenuItemsSoldByItem[key]
																		.map(arrayOfSoldMenuItemsInCategory => new BigNumber(arrayOfSoldMenuItemsInCategory.itemPrice))
																		.reduce((acc, cur) => acc.plus(cur))); // creates an array instead of an object
		*/

		// Can remove the consts 
		// Can abstract these out into a single function
		const menuItemsGross = Object.keys(allMenuItemsSoldByItem)
										.map(key => {
										grossSalesByMenuItemObject[key] = allMenuItemsSoldByItem[key]
										.map(arrayOfSoldMenuItemsInCategory => new BigNumber(arrayOfSoldMenuItemsInCategory.itemPrice))
										.reduce((acc, cur) => acc.plus(cur)).toNumber()
										return ({[key]:grossSalesByMenuItemObject[key]})
								}) 
		

		
		const serverTallyGross = Object.keys(allTicketsByServer).forEach(key => grossSalesByServer[key] = allTicketsByServer[key]
																		.map(arrayOfSoldMenuItemsInCategory => new BigNumber(arrayOfSoldMenuItemsInCategory.totalReal))
																		.reduce((acc, cur) => acc.plus(cur)).toNumber())
		const menuItemCategory = Object.keys(allMenuItemsSoldByCategory).map(key => grossSalesByMenuItemCategory[key] = allMenuItemsSoldByCategory[key]
																		.map(arrayOfSoldMenuItemsInCategory => new BigNumber(arrayOfSoldMenuItemsInCategory.itemPrice))
																		.reduce((acc, cur) => acc.plus(cur)).toNumber())
		const grossSalesByServerArray = []
		const grossSalesByMenuItemCategoryArray = []
		const grossSalesByMenuItemArray = []
		Object.keys(allMenuItemsSoldByItem).forEach(key => grossSalesByMenuItemArray.push({	[key]:allMenuItemsSoldByItem[key] }))
		Object.keys(allMenuItemsSoldByCategory).forEach(key => grossSalesByMenuItemCategoryArray.push({	[key]:allMenuItemsSoldByCategory[key] }))
		Object.keys(allTicketsByServer).forEach(key => grossSalesByServerArray.push({	[key]:allTicketsByServer[key] }))


		
		

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
			gross_sale_by_menu_item_array_d3: grossSalesByMenuItemArray,
			gross_sales_by_server_array_d3: grossSalesByServerArray,
			gross_sales_by_menu_item_category_array_d3: grossSalesByMenuItemCategoryArray,
			gross_sales_by_menu_item: grossSalesByMenuItemObject,
			gross_sales_by_server: grossSalesByServer,
			gross_sales_by_menu_item_category: grossSalesByMenuItemCategory,
			test: menuItemsGross,

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