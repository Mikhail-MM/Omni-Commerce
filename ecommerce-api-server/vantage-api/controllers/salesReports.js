const mongoose = require('mongoose');
const Schemas = require('../models/schemas/transaction')
const TicketTransaction = Schemas.ticketSchema
const SalesReportSchema = Schemas.salesReportSchema
const BigNumber = require('bignumber.js')
const _ = require('underscore')

// Create + Lookup In One Function (Need To Separate)

module.exports.tabulateDailyTicketSales = async function(req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	const DailySalesReports = mongoose.model('SalesReport', SalesReportSchema, req.headers['x-mongo-key'] + '_SalesReports') 
	try {

		const allTicketsBySession = await Transaction.find({});
		const beginDate = new Date(allTicketsBySession[0].createdAt)
		const endDate = new Date(allTicketsBySession[allTicketsBySession.length - 1].createdAt)
		console.log(beginDate)
		console.log(endDate)
		const newDailySalesReport = new DailySalesReports({
			tickets: allTicketsBySession,
			beginDate: beginDate,
			endDate: endDate
		})

		const salesNow = await newDailySalesReport.save()

		res.json(salesNow)

	} catch(err) { next(err) }
}

module.exports.lookupByTimestamp = async function(req, res, next) {
	const DailySalesReports = mongoose.model('SalesReport', SalesReportSchema, req.headers['x-mongo-key'] + '_SalesReports')
	try {
		console.log("Looking For Sales Reports - Listing Start and End Date : ")
		console.log(req.body.beginDate);
		console.log(req.body.endDate);
		const arrayOfSalesReports = await DailySalesReports.find({ $and: [ {beginDate: {$gte: req.body.beginDate }}, {endDate: {$lte: req.body.endDate}} ] })
		
		//TODO: Abstract This Out To Accept An {ARRAY OF ARRAYS OF TICKET OBJECTS or A SINGLE ARRAY OF TICKET OBJECTS - Handle CONCAT conditionally}
		// Get array of all menuItems
		const allTicketsBySession = arrayOfSalesReports.map(salesReportData => salesReportData.tickets).reduce((acc, cur) => acc.concat(cur))


		const allTicketsByCategory = _.groupBy(allTicketsBySession, 'status')

		const allPaidTickets = allTicketsByCategory["Paid"]
		const numPaidTickets = allTicketsByCategory["Paid"].length
		const numVoidTickets = allTicketsByCategory["Void"].length // Create exception handle for 0 or undefined
	
		
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

		res.json(data)
	} catch(err) { next(err) }
}

module.exports.getSalesReportById = async function(req, res, next) {
	const DailySalesReports = mongoose.model('SalesReport', SalesReportSchema, req.headers['x-mongo-key'] + '_SalesReports')
	try {
		const salesReport = await DailySalesReports.findOne({_id: req.body})
		res.json(salesReport)
	} catch(err) { next(err) }
}

module.exports.getAllSalesReports = async function(req, res, next) {
	const DailySalesReports = mongoose.model('SalesReport', SalesReportSchema, req.headers['x-mongo-key'] + '_SalesReports')
	try {
		const salesReports = await DailySalesReports.find({})
		res.json(salesReports)
	} catch(err) { next(err) }
}
