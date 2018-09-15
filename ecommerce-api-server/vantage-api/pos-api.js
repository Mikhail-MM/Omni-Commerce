////////////////////////////////////////////////////
//				Dependencies					  //
////////////////////////////////////////////////////

console.log("your app..is somehow running...")

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
require('dotenv').config()



const app = express();
const server = require('http').createServer(app);
console.log("Created Server")
const socketIO = require('./socket/initialize').initialize(server)
console.log("Created SocketIO instance")

const clients = require('./controllers/clients');
const images = require('./controllers/images');
const events = require('./controllers/events');
const employees = require('./controllers/employees');
const messages = require('./controllers/messages');
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
const social = require('./controllers/social')
const aws = require('./controllers/aws')

const seed = require('./seed/seed')

const router = express.Router(); 


mongoose.Promise = global.Promise; 

mongoose.connect(`mongodb://${process.env.MLABS_USER}:${process.env.MLABS_PW}@ds113000.mlab.com:13000/omninova`, { useMongoClient: true });

if(app.get('env') === 'development') var dev = true;
if (dev) app.use(logger('dev'));
if(app.get('env') === 'production') {
	return
	// Init script can be built to instantiate first Admin
};

app.use(bodyParser.json());

app.use('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, x-access-token, x-user-pathway, x-mongo-key, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
});

app.use(express.static(path.join(__dirname, '/../../build')));


////////////////////////////////////////////////////////////
//					Routes								  //
////////////////////////////////////////////////////////////



/*
router.route('/clients/lookupEmployees')mongodb://localhost/vantageAPI-2
	.get(authorize.adminRequired, clients.findAllEmployees)
*/



router.route('/sign-s3')
	.get(aws.signS3Request)
router.route('/registration/omni-master/')
	.post(register.registerOmniMaster)
router.route('/registration/essos-user/')
	.post(register.registerEssosUser)
router.route('/registration/omni-child/')
	.post(authorize.routeEmployeeToMongoCollection, register.registerOmniChild)

router.route('/seed/omni/')
	.post(seed.seedOmniUsers)
router.route('/seed/essos/')
	.post(seed.seedEssosMarket)
router.route('/seed/jumbo')
	.post(seed.seedFeaturedItems)

router.route('/events')
	.get(authorize.routeEmployeeToMongoCollection, events.getEventFeed)
	.post(authorize.routeEmployeeToMongoCollection, events.postNewEvent)

router.route('/social/follow/:id')
	.put(authorize.routeMarketplaceClient, social.follow)
// really need to consolidate this with our old client functions and make all our endpoints more REST ful...
router.route('/users/essos/getProfileView/ownProfile')
	.get(authorize.routeEmployeeToMongoCollection, clients.getOwnMetadata)
router.route('/users/essos/getProfileView/:id') 
	.get(clients.getProfileMetadata)

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

router.route('/timesheets')
	.get(authorize.routeEmployeeToMongoCollection, timesheets.getAllTimesheets)
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


router.route('/essos/updateOrderStatus')
	.put(authorize.routeMarketplaceClient, sellOrders.updateStatus)

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


router.route('/storeItem/wishlist/')
	.get(authorize.routeMarketplaceClient, storeItems.retrieveUserWishlist)
router.route('/storeItem/wishlist/:id')
	.put(authorize.routeMarketplaceClient, storeItems.handleWishlistRequest)
router.route('/storeItem/ratings/:id')
	.put(authorize.routeMarketplaceClient, storeItems.appendRatingToItem)
router.route('/storeItem/marketplaceLookup/:id')
	.get(storeItems.findAllItemsFromMarketplace);
router.route('/storeItem/noIDhack/:id')
	.get(storeItems.retrieveStoreItemWithoutId)
router.route('/storeItem/:id')
	.get(storeItems.getStoreItemById)
	.put(storeItems.updateStoreItemById)
	.delete(authorize.routeMarketplaceClient, storeItems.deleteStoreItem);
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

router.route('*')
	.get((req, res) => {
  		res.sendFile(path.join(__dirname+'/../../build/index.html'));
	});

app.use('/', router);

// Socket.IO //


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


server.listen(process.env.PORT);

console.log('Listening at http://localhost: %s in %s mode',
	server.address().port, app.get('env'));

module.exports = app;