
const mongoose = require('mongoose');
const Schemas = require('../models/schemas/marketplace')
const MarketplaceModels = require('../models/schemas/marketplace')
const sellerSpecificPurchaseOrderModel = MarketplaceModels.sellerSpecificPurchaseOrderModel;


module.exports.createNewSellOrder = async function(req, res, next) { 
		try {
			const data = req.body
				const newSellOrder = new sellerSpecificPurchaseOrderModel(data)
				const savedSellOrder = await newSellOrder.save()
					res.json(savedSellOrder)
		} catch(err) { next(err) }
}
module.exports.getAllSellOrders = async function(req, res, next) {
		try {
			const foundSellOrder = await sellerSpecificPurchaseOrderModel.find({});
				res.json(foundSellOrder)
		} catch(err) { next(err) }
}
module.exports.getSellOrderById = async function(req, res, next) {
		try {
			const sellOrder = await sellerSpecificPurchaseOrderModel.findOne({_id: req.params.id}) 
				res.json(sellOrder)
		} catch(err) { next(err) }
}
module.exports.updateSellOrderById = async function(req, res, next) { 
		try {
			const updatedSellOrder = await sellerSpecificPurchaseOrderModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new:true })
				res.json(updatedSellOrder)
		} catch(err) { next(err) }
}
module.exports.getMySellOrders = async function(req, res, next) {
	try {
		const sellOrdersByUser = await sellerSpecificPurchaseOrderModel.find({sellerRef_id: req.body.client._id})
			res.json(sellOrdersByUser)

	} catch(err) { next(err) }
}