const uuid4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')

const Client = require('../models/schemas/client');
const Users = require('../models/schemas/users');

const OmniUser = Users.OmniUser;
const EssosUser = Users.EssosUser;

const storeConfig = require('../models/schemas/storeConfig')
const storeConfigSchema = storeConfig.storeConfigSchema

const MarketPlaceModels = require('../models/schemas/marketplace')

const Marketplace = MarketPlaceModels.marketplaceSchema
const MarketplaceModel = mongoose.model('Marketplace', Marketplace)

const ShoppingCartModel = MarketPlaceModels.ShoppingCartModel


module.exports.registerOmniMaster = async (req, res, next) => {
	try {
		
		const mongoCollectionKey = uuid4().slice(0, 13);

		const hashedPass = await bcrypt.hash(req.body.password, 10);
		const terminalHash = await bcrypt.hash(mongoCollectionKey, 10);
		
		
		const userData = {
			
			email: req.body.email,

			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phone: req.body.phone,

			avatarURL: req.body.avatarURL,

			hash: hashedPass,
			
			accountType: 'Master',
			role: 'Administrator',
			isMaster: true,
			isAdmin: true,

			teminalIDNumber: 1,
			employeeCounter: 2,

			mongoCollectionKey: mongoCollectionKey,

		};

		const terminalData = {
			email: `${mongoCollectionKey}@terminal.com`,
			hash: terminalHash,
			
			accountType: 'Terminal',
			isAdmin: false,
			isMaster: false,

			teminalIDNumber: 0,

			mongoCollectionKey: mongoCollectionKey,

		};

		const newOmniMaster = new OmniUser(userData);
		const newOmniTerminal = new OmniUser(terminalData);

		const savedOmniMaster = await newOmniMaster.save();
		const savedOmniTerminal = await newOmniTerminal.save();

		const StoreConfig = mongoose.model('StoreConfig', storeConfigSchema, req.body.mongoCollectionKey + '_StoreConfig');
		
		const newStoreConfig = new StoreConfig({

			mongoKey: req.body.mongoCollectionKey,
			loggedInUsers: ["Terminal"]

		});

		const savedStoreConfig = await newStoreConfig.save();

		const response = {
			
			user: savedOmniMaster,
			savedOmniTerminal,
			savedStoreConfig,

		};

		res.json(response);

	} catch(err) { next(err); }

}

module.exports.registerEssosUser = async (req, res, next) => {
	try {
		
		const mongoCollectionKey = uuid4().slice(0, 13);
		const hashedPass = await bcrypt.hash(req.body.password, 10);

		const userData = {
			email: req.body.email,
			hash: hashedPass,

			accountType: 'Essos',
			
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phone: req.body.phoneNumber,

			billing_address_line1	: req.body.billing_address_line1,
			billing_address_line2	: req.body.billing_address_line2,
			billing_address_city	: req.body.billing_address_city,
			billing_address_zip		: req.body.billing_address_zip,
			billing_address_state	: req.body.billing_address_state,
			shipping_address_line1	: req.body.shipping_address_line1,
			shipping_address_line2	: req.body.shipping_address_line2,
			shipping_address_city	: req.body.shipping_address_city,
			shipping_address_zip	: req.body.shipping_address_zip,
			shipping_address_state	: req.body.shipping_address_state,

			mongoCollectionKey: mongoCollectionKey,
			avatarURL: req.body.avatarURL,

		};


		const newEssosUser = new EssosUser(userData);
		const savedEssosUser = await newEssosUser.save();

		const newShoppingCart = new ShoppingCartModel({ 
						
			ownerRef_id			: savedEssosUser._id,
			subtotalDisplay		: 0,
			subtotalReal		: 0,
			taxDisplay			: 0,
			taxReal				: 0,
			totalDisplay		: 0,
			totalReal			: 0,
		
		});

		
		const savedShoppingCart = await newShoppingCart.save();


		const response = {
			user: savedEssosUser,
			savedShoppingCart,
		};

		res.json(response);

	} catch(err) { next(err) }

}
module.exports.registerOmniChild = async (req, res, next) => {
	try {
		const masterAccount = await OmniUser.findOne({mongoCollectionKey: req.body.client.mongoCollectionKey})

		if (!masterAccount) { 
			console.log("Master Account does not exist - Delete client and abort ! ")
			return res.status(400).send("Could not find a Master account with that organization name - Retry please") 
		}

		const hashedPass = await bcrypt.hash(req.body.password, 10);
		
		const childData = {
			email: req.body.email,
			
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phone: req.body.phone,

			hash: hashedPass,
			
			accountType: 'Child',
			role: req.body.role,
			isMaster: false,
			isAdmin: false,

			terminalIDNumber: masterAccount.employeeCounter,

			mongoCollectionKey: req.body.client.mongoCollectionKey,
		}

		const iteratedBossEmployeeCounter = masterAccount.employeeCounter + 1
	
		const newEssosChild = new EssosUser(childData);
		const savedEssosUser = await newEssosUser.save();

		const iteratedBoss = await OmniUser.findByIdAndUpdate(masterAccount._id, { employeeCounter: req.body.newEmployeeCount }, { new: true }) 
	
	} catch(err) { next(err) }

}


module.exports.configureNewUser = function(req, res, next) {
	if (req.body.isBusinessOwner) {
		req.body.isMaster = true;
		req.body.isAdmin = true;
		req.body.employeeCounter = 0;
		req.body.accountType = "Master";
		// Generate unique identifier for Organization
			const mongoCollectionKey = uuid4().slice(0, 13);
			req.body.mongoCollectionKey = mongoCollectionKey;
			// Create Point Of Sale Bot
			createTerminalAccount(req, res, next)
	}

	if (req.body.isOnlineMerchant) {
		console.log("Online Merchant Configuration")
		const mongoCollectionKey = uuid4().slice(0, 13);
		req.body.mongoCollectionKey = mongoCollectionKey;
		req.body.accountType = "OnlineMerchant"

		next();
	}

	if (req.body.isEmployee) {
		req.body.isMaster = false;
		req.body.accountType = "Employee"
		req.body.employeeAuthorization = false;
		findMasterAndTagChild(req, res, next)		
	}
}



createTerminalAccount = async function(req, res, next) {
	try {
		data = {
			email: req.body.mongoCollectionKey + '@terminal.com',
			isMaster: false,
			isAdmin: false,
			mongoCollectionKey: req.body.mongoCollectionKey, 
			password: req.body.mongoCollectionKey, // change later
			accountType: "Terminal"
		}


			// Add Terminal Acc. to Store Config of logged users:
		const StoreConfig = mongoose.model('StoreConfig', storeConfigSchema, req.body.mongoCollectionKey + '_StoreConfig');
		const newStoreConfig = new StoreConfig({
			mongoKey: req.body.mongoCollectionKey,
			loggedInUsers: ["Terminal"]
		})
		console.log(newStoreConfig);
		const savedStoreConfig = await newStoreConfig.save()
		console.log("StoreConfig", savedStoreConfig);


		var newTerminal = new Client(data);
		if (!newTerminal.hash) {
				var plaintext = data.password;
				const saltRounds = 10;
				
				bcrypt.hash(plaintext, saltRounds).then(async (hash) => {
					
					newTerminal.hash = hash;
					

					const savedTerminal = await newTerminal.save()

					next();

			});
		};
	} catch(err) { next(err)}
}

findMasterAndTagChild = async function(req, res, next) {
	try {
		const boss = await Client.findOne({
			isMaster: true,
			organizationName: req.body.employerLookup
		});

		if (!boss) { 
			console.log("Master Account does not exist - Delete client and abort ! ")
			return res.status(400).send("Could not find a Master account with that organization name - Retry please") 
		}

		console.log("Found Master:")
		console.log(boss)
		console.log("Master's Mongo Key:")
		console.log(boss.mongoCollectionKey)
				req.body.mongoCollectionKey = boss.mongoCollectionKey;
				req.body.organizationName = boss.organizationName;
				req.body.master_id = boss._id;

				req.body.clockInNumber = boss.employeeCounter; 
		console.log("Updating new user's Clock-In Number")
		console.log("Boss' old employeeCounter is: ")
		console.log(boss.employeeCounter)
		console.log("Appending this to the new employee: ")
		console.log(req.body.clockInNumber)
				req.body.newEmployeeCount = boss.employeeCounter + 1
		console.log("Incrementing new counter: ")
		console.log(req.body.newEmployeeCount)
		console.log("Running findByIdAndUpdate...")
				updateEmployerEmployeeCount(req, res, next);
			console.log("New req.body:")
			console.log(req.body)
			next();
	}
	catch (err) {
		next(err)
	}
}

updateEmployerEmployeeCount = function(req, res, next) {
		Client.findByIdAndUpdate(req.body.master_id, { employeeCounter: req.body.newEmployeeCount }, {new: true}, function(err, newBoss) { 
			console.log("Employer's Employer Counter Updated: ")
				console.log(newBoss)
				return;
			})
}