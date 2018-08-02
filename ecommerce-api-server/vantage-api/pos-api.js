////////////////////////////////////////////////////
//				Dependencies					  //
////////////////////////////////////////////////////


const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const multer = require('multer');
// Can conditionally change storage destination based on original file field 

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 
			config.imgUploadDestination.marketplaceItem
		)	
	}
})

const upload = multer({ storage: storage })

const config = require('./models/config');


const clients = require('./controllers/clients');
const images = require('./controllers/images')
const employees = require('./controllers/employees');
const messages = require('./controllers/messages')
const menus = require('./controllers/menus');
const transactions = require('./controllers/transactions');
const authorize = require('./controllers/authorize');
const timesheets = require('./controllers/timeSheets')
const register = require('./controllers/registration');
const storeConfig = require('./controllers/storeConfig')
const salesReports = require('./controllers/salesReports')
const payments = require('./controllers/payments')
const marketplaces = require('./controllers/marketplaces')
const storeItems = require('./controllers/storeItems')
const shoppingCarts = require('./controllers/shoppingCarts')
const purchaseOrders = require('./controllers/purchaseOrders')
const sellOrders = require('./controllers/sellOrders')

var app = express();
var router = express.Router(); 

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vantageAPI-2', { useMongoClient: true });

if(app.get('env') === 'development') var dev = true;
if (dev) app.use(logger('dev'));
if(app.get('env') === 'production') {
	return
	// Init script can be built to instantiate first Admin
};

app.use(bodyParser.json());

app.use('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, x-access-token, x-mongo-key, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
});




////////////////////////////////////////////////////////////
//					Routes								  //
////////////////////////////////////////////////////////////



/*
router.route('/clients/lookupEmployees')
	.get(authorize.adminRequired, clients.findAllEmployees)
*/


// New Registration Pathways

router.route('/omni-master/')
	.post(register.registerOmniMaster)
router.route('/essos-user/')
	.post(register.registerEssosUser)

router.route('/clients/marketplace')
	.post(upload.single('marketplaceAvatar'), images.uploadNewImage, register.configureNewUser, clients.createClient)
router.route('/clients/lookup')
	.post(clients.autoCompleteClientOrgName);
router.route('/clients')
	.get(clients.getAllClients)
	.post(register.configureNewUser, clients.createClient);
router.route('/clients/:id')
	.put(clients.updateClient)
	.delete(clients.deleteClientById);

router.route('/images/marketplace-item')
	.post(upload.single('marketplaceItems'), images.uploadNewImage)
router.route('/images/point-of-sale-item')
	.post(upload.single('menuItems'), images.uploadNewImage)

router.route('/client/metadata') 
	.get(authorize.routeEmployeeToMongoCollection, authorize.sendStripeTokenMetadataToClient)

router.route('/messages')
	.get(authorize.routeEmployeeToMongoCollection, messages.getAllMyMessages)
	.post(authorize.routeEmployeeToMongoCollection, messages.composeNewMessage)
	.delete(authorize.routeEmployeeToMongoCollection, messages.deleteMessage);

router.route('/announcements')
	.get(authorize.routeEmployeeToMongoCollection, messages.getAllAnnouncementsByOrganization)
	.post(authorize.routeEmployeeToMongoCollection, messages.composeNewAnnouncement)
	.delete(authorize.routeEmployeeToMongoCollection, authorize.adminRequired, messages.deleteMessage);

router.route('/employees/find_all')
	.get(authorize.routeEmployeeToMongoCollection, employees.findMyEmployees);
router.route('/employees/authorize')
	.post(authorize.adminRequired, employees.approveEmployeeSignUp)
router.route('/employees/invalidate')
	.post(authorize.adminRequired, employees.disableEmployeeAccess)

router.route('/menus/noIDhack/:id')
	.get(authorize.routeEmployeeToMongoCollection, menus.getMenuItemByIdNoReturnId);
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
	.put(authorize.routeEmployeeToMongoCollection, transactions.updateTransactionById)
	.delete(authorize.routeEmployeeToMongoCollection, transactions.deleteTransactionById);

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

router.route('/marketplace/:id')
	.get(marketplaces.getMarketplaceById)
	.put(marketplaces.updateMarketplaceById)
router.route('/marketplace')
	.get(marketplaces.getAllMarketplaces)
	.post(marketplaces.createNewMarketplace);

// Note: Still need to divvy up purchase orders and arrange them to sellers
router.route('/shoppingCart/payment/')
	.post(authorize.routeMarketplaceClient, shoppingCarts.validateMarketplacePayment, shoppingCarts.calculatePricing, payments.saveStripeCustomerInformation);
router.route('/shoppingCart/checkOut/')
	.post(authorize.routeMarketplaceClient, shoppingCarts.validateCartStock, shoppingCarts.calculatePricing);
router.route('/shoppingCart/userLookup/')
	.get(authorize.routeMarketplaceClient, shoppingCarts.getShoppingCartByClientRef);
router.route('/shoppingCart/addItem/')
	.put(authorize.routeMarketplaceClient, shoppingCarts.pushItemIntoShoppingCart, shoppingCarts.calculatePricing);
router.route('/shoppingCart/removeItem/')
	.put(authorize.routeMarketplaceClient, shoppingCarts.removeItemFromShoppingCart, shoppingCarts.calculatePricing);
router.route('/shoppingCart/:id')
	.get(authorize.routeMarketplaceClient, shoppingCarts.getShoppingCartById)
	.put(authorize.routeMarketplaceClient, shoppingCarts.updateShoppingCartById, shoppingCarts.calculatePricing);
router.route('/shoppingCart')
	.get(authorize.routeMarketplaceClient, shoppingCarts.getAllShoppingCarts)
	.post(authorize.routeMarketplaceClient, shoppingCarts.createShoppingCart);

router.route('/purchaseorders/userLookup/')
	.get(authorize.routeMarketplaceClient, purchaseOrders.getMyPurchaseOrders);
router.route('/purchaseorders')
	.get(authorize.routeMarketplaceClient, purchaseOrders.getAllPurchaseOrders)
	.post(authorize.routeMarketplaceClient, purchaseOrders.createNewPurchaseOrder);
router.route('/purchaseorders/:id')
	.get(authorize.routeMarketplaceClient, purchaseOrders.getPurchaseOrderById)
	.put(authorize.routeMarketplaceClient, purchaseOrders.updatePurchasOrderById);

router.route('/sellorders/userLookup/')
	.get(authorize.routeMarketplaceClient, sellOrders.getMySellOrders);
router.route('/sellorders')
	.get(authorize.routeMarketplaceClient, sellOrders.getAllSellOrders)
	.post(authorize.routeMarketplaceClient, sellOrders.createNewSellOrder);
router.route('/sellorders/:id')
	.get(authorize.routeMarketplaceClient, sellOrders.getSellOrderById)
	.put(authorize.routeMarketplaceClient, sellOrders.updateSellOrderById);


router.route('/storeItem/marketplaceLookup/:id')
	.get(storeItems.findAllItemsFromMarketplace);
router.route('/storeItem/noIDhack/:id')
	.get(storeItems.retrieveStoreItemWithoutId)
router.route('/storeItem/:id')
	.get(storeItems.getStoreItemById)
	.put(storeItems.updateStoreItemById);
router.route('/storeItem/')
	.get(storeItems.getAllStoreItems)
	.post(authorize.routeMarketplaceClient, storeItems.createNewStoreItem);


router.route('/storeconfig')
	.get(authorize.routeEmployeeToMongoCollection, storeConfig.getLoggedUsers);

router.route('/authorize')
	.post(authorize.login);

router.route('/payments/stripe')
	.post(payments.createStripeCharge);
router.route('/payments/cash')
	.post(authorize.routeEmployeeToMongoCollection, payments.createCashCharge, transactions.updateTransactionById);
router.route('/test')
	.get(shoppingCarts.test);

app.use('/', router);


//	Error Handling Middleware	//
///		404 Handler			  ///

app.use(function(req, res, next){
	var err = new Error("Response Status: 404; Page Not Found")
	err.status = 404
	next(err);
})

//	Development Error Handler

if (dev) {
	app.use(function(err, req, res, next) {
		console.log(err);
		res.status(err.status || 500).send();
	});
}

//	Production Error Handler

app.use(function(err, req, res, next) {
	res.status(err.status || 500).send();
});

var server = app.listen(config.port);

console.log('Listening at http://localhost: %s in %s mode',
	server.address().port, app.get('env'));

module.exports = app;