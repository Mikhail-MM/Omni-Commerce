const mongoose = require('mongoose');
const Schemas = require('../models/schemas/transaction')
const TicketTransaction = Schemas.ticketSchema
const SalesReportSchema = Schemas.salesReportSchema
const BigNumber = require('bignumber.js')
const _ = require('underscore')

// Create + Lookup In One Function (Need To Separate)
module.exports.aggregateSalesData = async function(req, res, next) { // This will work for a DAILY sales report
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	const DailySalesReport = mongoose.model('SalesReport', SalesReportSchema, req.headers['x-mongo-key'] + '_SalesReports') 
	try {

		const allTicketsBySession = await Transaction.find({});
		const beginDate = new Date(allTicketsBySession[0].createdAt)
		const endDate = new Date(allTicketsBySession[allTicketsBySession.length - 1].createdAt)
		console.log(beginDate)
		console.log(endDate)
		const newDailySalesReport = new DailySalesReport({
			tickets: allTicketsBySession,
			beginDate: beginDate,
			endDate: endDate
		})
		
		const salesNow = await newDailySalesReport.save()

		const allTicketsByCategory = _.groupBy(allTicketsBySession, 'status')

		const allPaidTickets = allTicketsByCategory["Paid"]
		const numPaidTickets = allTicketsByCategory["Paid"].length
		const numVoidTickets = allTicketsByCategory["Void"].length // Create exception handle for 0 or undefined
	
		// Need to tally all waste thru voids
		
		const allTicketsByServer = _.groupBy(allPaidTickets, 'createdBy')
		const allMenuItemsSoldAndPaidFor = allPaidTickets
									.map(ticket => ticket.items)
									.reduce((acc, cur) => acc.concat(cur))
		
		const allMenuItemsSoldByItem = _.groupBy(allMenuItemsSoldAndPaidFor, 'itemName')
		const allMenuItemsSoldByCategory = _.groupBy(allMenuItemsSoldAndPaidFor, 'category')

		const grossSalesByMenuItemObject = {}
		const grossSalesByServer = {}
		const grossSalesByMenuItemCategory = {}

		const menuItemsGross = Object.keys(allMenuItemsSoldByItem)
										.map(key => {
										grossSalesByMenuItemObject[key] = allMenuItemsSoldByItem[key]
										.map(arrayOfSoldMenuItemsInCategory => new BigNumber(arrayOfSoldMenuItemsInCategory.itemPrice))
										.reduce((acc, cur) => acc.plus(cur)).toNumber()
										return ({"dataKey":key, "dataValue":grossSalesByMenuItemObject[key]}) // For recharts may have to do ({name:[key], value: grossSalesByMenuItemObject[key]})
								})
		const serverTallyGross = Object.keys(allTicketsByServer)
										.map(key => {
										grossSalesByServer[key] = allTicketsByServer[key]
										.map(arrayOfSoldMenuItemsInCategory => new BigNumber(arrayOfSoldMenuItemsInCategory.totalReal))
										.reduce((acc, cur) => acc.plus(cur)).toNumber()
										return ({"dataKey":key, "dataValue":grossSalesByServer[key]})
								})
		const menuItemCategoryGross = Object.keys(allMenuItemsSoldByCategory)
										.map(key => { 
										grossSalesByMenuItemCategory[key] = allMenuItemsSoldByCategory[key]
										.map(arrayOfSoldMenuItemsInCategory => new BigNumber(arrayOfSoldMenuItemsInCategory.itemPrice))
										.reduce((acc, cur) => acc.plus(cur)).toNumber()
										return({"dataKey":key, "dataValue":grossSalesByMenuItemCategory[key]})
								})
		
const timeSeriesData = allPaidTickets
.map(ticket => {
	const currentTicketSale = new BigNumber(ticket.totalReal)
		return({"time": ticket.createdAt, "sales": currentTicketSale})
})
const finalGross = timeSeriesData
.map(object => object["sales"])
.reduce((acc, cur, index) => {
	timeSeriesData[index]["sales"] = acc.toNumber()
	if ( index === 1 ) timeSeriesData[0].sales = cur.toNumber() 
	return acc.plus(cur);
	}).toNumber() 
	
timeSeriesData[timeSeriesData.length - 1].sales = finalGross
											
		const grossSales = allPaidTickets
						   	.map(ticket => new BigNumber(ticket.totalReal))
						   	.reduce((acc, cur) => acc.plus(cur)).toNumber()


		const data = { // take out snake_case
			allTickets: allTicketsBySession,
			allPaidTickets: allPaidTickets,
			allPaidTicketsByCategory: allTicketsByCategory,
			allPaidTicketsByServer: allTicketsByServer,
			allPaidMenuItems: allMenuItemsSoldAndPaidFor,
			allPaidMenuItemsCategorizedByItem: allMenuItemsSoldByItem,
			allPaidMenuItemsCategorizedByCategory: allMenuItemsSoldByCategory,
			numPaidTix: numPaidTickets,
			numVoidTix: numVoidTickets,
			grossByMenuItem: menuItemsGross,
			grossByServer: serverTallyGross,
			grossByCategory: menuItemCategoryGross,
			grossSales: grossSales,
			salesOverTime: timeSeriesData,


		}
		const savedData = {

		}
		console.log(salesNow)
		res.json(data)
	} catch(err) { next(err) }
} 

// Read

/*
How can I access a key of an object using bracket notation within an array - i.e.  does this work: `array[3]["key"]`, or do i have to do const 
*/