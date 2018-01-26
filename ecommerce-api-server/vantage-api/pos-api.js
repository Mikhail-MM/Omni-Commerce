// Notes
// Offline functionality can be made by creating JS objects to store within LocalStorage 


////////////////////////////////////////////////////
//				Dependencies					  //
////////////////////////////////////////////////////


const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');



const config = require('./models/config');

const clients = require('./controllers/clients');
const menus = require('./controllers/menus');
const transactions = require('./controllers/transactions');
const authorize = require('./controllers/authorize');
const timesheets = require('./controllers/timeSheets')
const register = require('./controllers/registration');
const storeConfig = require('./controllers/storeConfig')
const salesReports = require('./controllers/salesReports')
const payments = require('./controllers/payments')

/* Depreciated Controllers 

const customers = require('./controllers/customers');
const members = require('./controllers/members');
const punchcards = require('./controllers/punchcards');

*/ 

//test@bones.com
var app = express();
var router = express.Router(); // retuns 404 if I use it lik in his example


//todo: Create functionality for connecting to a new DB depending on user login

//CONSIDER MAKING NEW CONNECTIONS
// var connection = mongoose.createConnection('mongodb://localhost:27017/test');
// YOU WILL CREATE NEW MODELS TO THIS CONNECTION!
// var Tank = connection.model('Tank', yourSchema);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vantageAPI-2', { useMongoClient: true });

var conn2 = mongoose.createConnection('mongodb://localhost/vantage2');

if(app.get('env') === 'development') var dev = true;
if (dev) app.use(logger('dev'));
if(app.get('env') === 'production') {
	return
	// run init script here
};

//Parse JSON Transmissions - responses, right?
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false }));


app.use('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, x-access-token, x-mongo-key, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
});

//////////////////////////////////////////////////////////
// TODO: ID Param (app.param('<paramname>') validation)///
//////////////////////////////////////////////////////////
//TODO//
//////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
//					Routes								  //
////////////////////////////////////////////////////////////

//app.post('/clients', clients.createClient);
//app.get('/clients', clients.getAllClients);

//.all can create a log entry in a manifest
// Create function to return ALL DB ITEMS??
router.route('/clients/lookup')
	.post(clients.autoCompleteClientOrgName);
router.route('/clients')
	.get(clients.getAllClients)
	.post(register.configureNewUser, clients.createClient);
router.route('/clients/:id')
	.put(clients.updateClient)
	.delete(clients.deleteClientById);
router.route('/menus/noIDhack/:id')
	.get(authorize.routeEmployeeToMongoCollection, menus.getMenuItemByIdNoReturnId)
router.route('/menus')
	.get(authorize.routeEmployeeToMongoCollection, menus.getAllMenuItems)
	.post(authorize.routeEmployeeToMongoCollection, menus.createNewMenuItem);
router.route('/menus/:id')
	.get(authorize.routeEmployeeToMongoCollection, menus.getMenuItemById)
	.put(authorize.routeEmployeeToMongoCollection, menus.updateMenuItemById)
	.delete(authorize.routeEmployeeToMongoCollection, menus.deleteMenuItemById);
router.route('/transactions/addItem/:id')	
	.put(authorize.routeEmployeeToMongoCollection, transactions.updatePushTransactionById, transactions.calculatePricing) 
router.route('/transactions/removeItem/:id')
	.put(authorize.routeEmployeeToMongoCollection, transactions.pullItemFromArray, transactions.calculatePricing)
router.route('/transactions/requestAddon/:id')
	.put(authorize.routeEmployeeToMongoCollection, transactions.pushCustomerAddon, transactions.calculatePricing)
router.route('/transactions')
	.get(authorize.routeEmployeeToMongoCollection, transactions.getAllTransactions)
	.post(authorize.routeEmployeeToMongoCollection, transactions.createNewTransaction);
router.route('/transactions/:id')
	.get(authorize.routeEmployeeToMongoCollection, transactions.getTransactionById)
	.put(authorize.routeEmployeeToMongoCollection, transactions.updateTransactionById) //SO FAR only does a PUSH
	.delete(authorize.routeEmployeeToMongoCollection, transactions.deleteTransactionById);
// Should merge under single roof
router.route('/timesheets/ci')
	.post(authorize.routeEmployeeToMongoCollection, timesheets.checkForMissedTimesheets, timesheets.createNewTimesheet, storeConfig.pushLoggedUser);
router.route('/timesheets/co')
	.put(authorize.routeEmployeeToMongoCollection, timesheets.clockOutEmployee, storeConfig.pullLoggedUser);
router.route('/salesReports/aggregate')
	.post(authorize.routeEmployeeToMongoCollection, salesReports.lookupByTimestamp);
router.route('/salesReports')
	.get(authorize.routeEmployeeToMongoCollection, salesReports.getAllSalesReports)
	.post(authorize.routeEmployeeToMongoCollection, salesReports.tabulateDailyTicketSales);
router.route('/salesReports/:id')
	.get(authorize.routeEmployeeToMongoCollection, salesReports.getSalesReportById);
router.route('/storeconfig')
	.get(authorize.routeEmployeeToMongoCollection, storeConfig.getLoggedUsers);
router.route('/authorize')
	.post(authorize.login);
router.route('/payments/stripe')
	.post(payments.createStripeCharge);
router.route('/payments/cash')
	.post(authorize.routeEmployeeToMongoCollection, payments.createCashCharge, transactions.updateTransactionById);
app.use('/', router);

//app.route('/clients')
//    .get(clients.getAllClients)
//    .post(clients.createClient);

//Interesting note. The commented out bottom section was working. The top section, above app.use, was NOT.
//It was returning 404. Why? Because if you are using the route middleware, you must mount it on the app via app.use('/', router). What is the first parameter, tho?
//router.route('/clients/:id')
	//TODO GetByID
//	.put(clients.updateClient)
//	.delete(clients.deleteClientById);

//Error Handling Middleware//
///404 Handler///

app.use(function(req, res, next){
	var err = new Error("Response Status: 404; Page Not Found")
	err.status = 404
	next(err);
})

//Development Error Handler
if (dev) {
	app.use(function(err, req, res, next) {
		console.log(err);
		res.status(err.status || 500).send();
	});
}

//Production Error Handler

app.use(function(err, req, res, next) {
	res.status(err.status || 500).send();
});

var server = app.listen(config.port);

console.log('Listening at http://localhost: %s in %s mode',
	server.address().port, app.get('env'));

module.exports = app;