// Import client Mongoose Model
const mongoose = require('mongoose');
const Client = require('../models/schemas/client');
const Users = require('../models/schemas/users');
const EssosUser = Users.EssosUser;

const bcrypt = require('bcrypt');
const MarketPlaceModels = require('../models/schemas/marketplace')

const Marketplace = MarketPlaceModels.marketplaceSchema
const MarketplaceModel = mongoose.model('Marketplace', Marketplace)
const ShoppingCartSchema = MarketPlaceModels.storeItemSchema
const ShoppingCartModel = MarketPlaceModels.ShoppingCartModel
//CREATE

module.exports.getProfileMetadata = async function(req, res, next) {
	const profileInfo = await EssosUser.findById(req.params.id, 'firstName lastName avatarURL')
	res.json(profileInfo)
}

module.exports.getOwnMetadata = async (req, res, next) => {
	const profileInfo = await EssosUser.findById(req.body.client._id, '_id firstName lastName avatarURL')
	res.json(profileInfo)
}
module.exports.createClient = async function(req, res, next) {

	try {
	// Object assign data from req.data - assign some registration middleware to alter the request
		var data = {
			firstName				: req.body.firstName,
			lastName				: req.body.lastName,
			phoneNumber				: req.body.phoneNumber,
			email					: req.body.email,
			isMaster				: req.body.isMaster,
			isAdmin					: req.body.isAdmin,
			mongoCollectionKey		: req.body.mongoCollectionKey,
			employeeCounter			: req.body.employeeCounter, 
			organizationName		: req.body.organizationName,
			clockInNumber			: req.body.clockInNumber,
			accountType				: req.body.accountType,
			master_id				: req.body.master_id,
			employeeAuthorization	: req.body.employeeAuthorization,
			billing_address_line1	: req.body.billing_address_line1,
			billing_address_line2	: req.body.billing_address_line2,
			billing_address_city	: req.body.billing_address_city,
			billing_address_zip		: req.body.billing_address_zip,
			billing_address_state	: req.body.billing_address_state,
			shipping_address_line1	: req.body.shipping_address_line1,
			shipping_address_line2	: req.body.shipping_address_line2,
			shipping__address_city	: req.body.shipping__address_city,
			shipping_address_zip	: req.body.shipping_address_zip,
			shipping_address_state	: req.body.shipping_address_state,
			userName				: req.body.userName,
		};



		
		

		var newClient = new Client(data);
		
	const response = {}
		
		if (!newClient.hash) {
			var plaintext = req.body.password;
			const saltRounds = 10;			
			const hashedPassword = await bcrypt.hash(plaintext, saltRounds);
			newClient.hash = hashedPassword;
				
				if (req.body.accountType === "OnlineMerchant") {

					if (!req.body.imageURL) {
						// set default market image
					}

				const storeData = {
					storeName: req.body.shopName,
					ownerName: req.body.userName,
					mongoCollectionKey: req.body.mongoCollectionKey,
					imageURL: req.body.imageURL
				}

				console.log("Store Data: ")
				console.log(storeData)


				const newMarketplace = new MarketplaceModel(storeData)
				const registeredMarketplace = await newMarketplace.save()

				response.createdMarketplace = registeredMarketplace
				newClient.marketplaceRef_id = registeredMarketplace._id
				console.log("New Marketplace: ")
				console.log(registeredMarketplace)
				}

			const registeredClient = await newClient.save();
			response.createdClient = registeredClient
			console.log("New Client: ")
			console.log(registeredClient)
		
				if(req.body.accountType === "OnlineMerchant") {
					
					const newShoppingCartForClient = new ShoppingCartModel({ 
						ownerRef_id			: registeredClient._id,
						subtotalDisplay		: 0,
						subtotalReal		: 0,
						taxDisplay			: 0,
						taxReal				: 0,
						totalDisplay		: 0,
						totalReal			: 0,
					})

					const boundShoppingCart = await newShoppingCartForClient.save()
					response.boundShoppingCart = boundShoppingCart
					const updatedMarketplaceWithClientRef = await MarketplaceModel.findOneAndUpdate({ _id: response.createdMarketplace._id }, { ownerRef_id: registeredClient._id}, { new: true })
					console.log("Updated Marketplace with Client Ref ID:")
					console.log(updatedMarketplaceWithClientRef)
					response.updatedCreatedMarketplace = updatedMarketplaceWithClientRef;
				}
		};
	
	console.log(response)
	res.json(response);

	} catch(err) { next(err) }
}

// TODO: Update to Async/Await

module.exports.autoCompleteClientOrgName = function (req, res, next) {
	console.log(req.body)
	// Make sure the i for case insensitive flag worked
	 Client.find({ organizationName: { $regex : "^" + req.body.employerLookup + "i"}}, 'organizationName', 
		function(err, clients) {
			console.log(clients)
			if (err) return next(err)
			return res.json(clients);
		})

		
}


module.exports.getAllClients = async function(req, res, next) {
	try {
		
		const clients = await Client.find({});
		
		return res.json(clients)
	
	} catch(err) { next(err) }
}

module.exports.findMasterAndTagChild = async function(req, res, next) {
	try{ 
		
		const client = await Client.findOne({
			isMaster: true,
			organizationName: req.body.organizationName,
		})

		req.body.mongoCollectionKey = client.mongoCollectionKey;

	} catch(err) { next(err) }
}


module.exports.updateClient = async function(req, res, next) {
	try{ 
		
		const client = await Client.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})

		if (!client) return res.status(404).send("No client with that ID")

		return res.json(client)

	} catch(err) { next(err) }
}

module.exports.deleteClientById = async function(req, res, next) {
	try{ 

		const client = await Client.findOneAndRemove({_id: req.params.id})

		if (!client) return res.json(404).send("No client with that ID")

		return res.sendStatus(200)

	} catch(err) { next(err) }
}
