
const mongoose = require('mongoose');
const Schemas = require('../models/schemas/marketplace')
const MarketplaceModels = require('../models/schemas/marketplace')
const sellerSpecificPurchaseOrderModel = MarketplaceModels.sellerSpecificPurchaseOrderModel;
const PurchaseOrderModels = MarketplaceModels.PurchaseOrderModel;


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

module.exports.updateStatus = async (req, res, next) => {
	try{
		const sellOrderToUpdate = await sellerSpecificPurchaseOrderModel.findById(req.body.sellOrderId).lean()
		const purchaseOrderToUpdate = await PurchaseOrderModels.findById(sellOrderToUpdate.masterPurchaseOrderRef_id).lean()

		let sellOrderSubdocs = sellOrderToUpdate.itemsBought
			// FrontEnd passes the unique _id of each subdoc item within the sell order
			const itemToUpdate = sellOrderSubdocs.find(item => item._id == req.body.itemSubdocId)
			const indexToUpdate = sellOrderSubdocs.findIndex(item => item._id == req.body.itemSubdocId)

		const newItemInstance = {...itemToUpdate, status: req.body.status}
		
		sellOrderSubdocs[indexToUpdate] = newItemInstance

		const updatedSellOrder = await sellerSpecificPurchaseOrderModel.findOneAndUpdate(
			{_id: req.body.sellOrderId},
			{ $set: { itemsBought: sellOrderSubdocs}}
		)


		let purchaseOrderSubdocs = purchaseOrderToUpdate.itemsBought
			// FrontEnd does not have access to the purchase order subdoc raw ID - need to look for itemRef Id
			const recieverItemToUpdate = purchaseOrderSubdocs.find(receivedItem => receivedItem.itemRef_id.toString() === newItemInstance.itemRef_id.toString() )
			const recieverIndexToUpdate = purchaseOrderSubdocs.findIndex(item => item.itemRef_id.toString() === newItemInstance.itemRef_id.toString())

			const newReceivedItemInstance = {...recieverItemToUpdate, status: req.body.status}

		purchaseOrderSubdocs[recieverIndexToUpdate] = newReceivedItemInstance

		const updatedPurchaseOrder = await PurchaseOrderModels.findOneAndUpdate(
			{_id: sellOrderToUpdate.masterPurchaseOrderRef_id},
			{ $set: { itemsBought: purchaseOrderSubdocs }}
		)

		res.json({
			updatedSellOrder,
			updatedPurchaseOrder
		})
	} catch(err) { next(err) }
}