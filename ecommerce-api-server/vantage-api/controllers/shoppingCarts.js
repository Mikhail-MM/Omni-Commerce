const mongoose = require('mongoose');
const Schemas = require('../models/schemas/marketplace')
const ShoppingCart = Schemas.storeItemSchema

module.exports.createShoppingCart = async function(req, res, next) { 
	const ShoppingCartModel = mongoose.model('ShoppingCart', ShoppingCart, req.headers['x-mongo-key'] + '_ShoppingCart')
		try {
			const newShoppingCart = new ShoppingCartModel(req.body)
			const savedModel = await newShoppingCart.save()
				res.json(savedModel)
		} catch(err) { next(err) }
}
module.exports.getAllShoppingCarts = async function(req, res, next) {
	const ShoppingCartModel = mongoose.model('ShoppingCart', ShoppingCart, req.headers['x-mongo-key'] + '_ShoppingCart')
		try {
			const foundShoppingCarts = await ShoppingCartModel.find({});
				res.json(foundStoreItems)
		} catch(err) { next(err) }
}
module.exports.getShoppingCartById = async function(req, res, next) {
	const ShoppingCartModel = mongoose.model('ShoppingCart', ShoppingCart, req.headers['x-mongo-key'] + '_ShoppingCart')
		try {
			const storeItem = await ShoppingCartModel.findOne({_id: req.params.id}) 
				res.json(storeItem)
		} catch(err) { next(err) }
}
module.exports.updateShoppingCartById = async function(req, res, next) { 
	const ShoppingCartModel = mongoose.model('ShoppingCart', ShoppingCart, req.headers['x-mongo-key'] + '_ShoppingCart')
		try {
			const updatedStoreItem = await ShoppingCartModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new:true })
				res.json(updatedStoreItem)
		} catch(err) { next(err) }
}