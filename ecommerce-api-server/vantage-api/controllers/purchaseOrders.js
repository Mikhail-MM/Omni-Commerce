
const mongoose = require('mongoose');
const Schemas = require('../models/schemas/marketplace')
const MarketplaceModels = require('../models/schemas/marketplace')
const PurchaseOrderModels = MarketplaceModels.PurchaseOrderModel;


module.exports.createNewPurchaseOrder = async function(req, res, next) { 
		try {
			const data = req.body
				const newPurchaseOrder = new PurchaseOrderModel(data)
				const savedPurchaseOrder = await newPurchaseOrder.save()
					res.json(savedPurchaseOrder)
		} catch(err) { next(err) }
}
module.exports.getAllPurchaseOrders = async function(req, res, next) {
		try {
			const foundPurchaseOrders = await PurchaseOrderModel.find({});
				res.json(foundPurchaseOrders)
		} catch(err) { next(err) }
}
module.exports.getPurchaseOrderById = async function(req, res, next) {
		try {
			const purchaseOrder = await PurchaseOrderModel.findOne({_id: req.params.id}) 
				res.json(purchaseOrder)
		} catch(err) { next(err) }
}
module.exports.updatePurchasOrderById = async function(req, res, next) { 
		try {
			const updatedPurchaseOrder = await PurchaseOrderModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new:true })
				res.json(updatedPurchaseOrder)
		} catch(err) { next(err) }
}
module.exports.getMyPurchaseOrders = async function(req, res, next) {
	try {
		const purchaseOrdersByUser = await PurchaseOrderModel.find({buyerRef_id: req.body.client._id})
			res.json(purchaseOrdersByUser)
	} catch(err) { next(err) }
}