const mongoose = require('mongoose');
const Schemas = require('../models/schemas/marketplace')
const MarketplaceModels = require('../models/schemas/marketplace')
const StoreItemModel = MarketplaceModels.StoreItemModel


module.exports.createNewStoreItem = async function(req, res, next) { 
		try {
			console.log("headers for info", req.headers['x-user-id'], req.headers['x-marketplace-ref'])
			const data = Object.assign({}, req.body, {
				sellerRef_id: req.headers['x-user-id'],
				marketplaceRef_id: req.headers['x-marketplace-ref']
			});
				const newStoreItem = new StoreItemModel(data)
				const savedModel = await newStoreItem.save()
				res.json(savedModel)
		} catch(err) { next(err) }
}
module.exports.getAllStoreItems = async function(req, res, next) {
		try {
			const foundStoreItems = await StoreItemModel.find({});
				res.json(foundStoreItems)
		} catch(err) { next(err) }
}
module.exports.getStoreItemById = async function(req, res, next) {
		try {
			const storeItem = await StoreItemModel.findOne({_id: req.params.id}) 
				res.json(storeItem)
		} catch(err) { next(err) }
}
module.exports.updateStoreItemById = async function(req, res, next) { 
		try {
			const updatedStoreItem = await StoreItemModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new:true })
				res.json(updatedStoreItem)
		} catch(err) { next(err) }
}
module.exports.findAllItemsFromMarketplace = async function(req, res, next) {
	try {
		console.log(req.params.id)
		const marketplaceSpecificStoreItems = await StoreItemModel.find({marketplaceRef_id: req.params.id})
			res.json(marketplaceSpecificStoreItems)
		
	} catch(err) { next(err) }
}

module.exports.retrieveStoreItemWithoutId = async function(req, res, next) {
try { 
	const noIdItem = await StoreItemModel.findOne({_id: req.params.id}, '-_id')
		res.json(noIdItem)
	} catch(err) { next(err) }
}

