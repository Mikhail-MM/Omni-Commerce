const mongoose = require('mongoose');
const Schemas = require('../models/schemas/marketplace')
const StoreItem = Schemas.storeItemSchema
const StoreItemModel = mongoose.model('StoreItem', StoreItem)

module.exports.createNewStoreItem = async function(req, res, next) { 
		try {
			const data = Object.assign({}, req.body, {
				ownerRef_id: req.body.client._id,
				marketplaceRef_id: req.body.client.marketplaceRef_id
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
		const marketplaceSpecificStoreItems = await StoreItemModel({marketplaceRef_Id: req.params.id})
		
	} catch(err) { next(err) }
}