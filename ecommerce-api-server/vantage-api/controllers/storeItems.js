
const mongoose = require('mongoose');
const Schemas = require('../models/schemas/storeItem')
const StoreItem = Schemas.marketplaceSchema


module.exports.createNewStoreItem = async function(req, res, next) { 
	const StoreItemModel = mongoose.model('StoreItem', StoreItem, req.headers['x-mongo-key'] + '_StoreItems')
		try {
			const newStoreItem = new StoreItemModel({ req.body })
			const savedModel = await newStoreItem.save()
				res.json(savedModel)
		} catch(err) { next(err) }
}
module.exports.getAllStoreItems = async function(req, res, next) {
	const StoreItemModel = mongoose.model('StoreItem', StoreItem, req.headers['x-mongo-key'] + '_StoreItems')
		try {
			const foundStoreItems = await StoreItemModel.find({});
				res.json(foundStoreItems)
		} catch(err) { next(err) }
}
module.exports.getStoreItemById = async function(req, res, next) {
	const StoreItemModel = mongoose.model('StoreItem', StoreItem, req.headers['x-mongo-key'] + '_StoreItems')
		try {
			const storeItem = await StoreItemModel.findOne({_id: req.params.id}) 
				res.json(storeItem)
		} catch(err) { next(err) }
}
module.exports.updateStoreItemById = async function(req, res, next) { 
	const StoreItemModel = mongoose.model('StoreItem', StoreItem, req.headers['x-mongo-key'] + '_StoreItems')
		try {
			const updatedStoreItem = await StoreItemModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new:true })
				res.json(updatedStoreItem)
		} catch(err) { next(err) }
}