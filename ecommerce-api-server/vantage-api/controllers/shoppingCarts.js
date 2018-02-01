const mongoose = require('mongoose');
const Schemas = require('../models/schemas/marketplace')
const ShoppingCartSchema = Schemas.shoppingCartSchema
const ShoppingCartModel = mongoose.model('ShoppingCart', ShoppingCartSchema)

module.exports.createShoppingCart = async function(req, res, next) { 
		try {
			const newShoppingCart = new ShoppingCartModel(req.body)
			const savedModel = await newShoppingCart.save()
				res.json(savedModel)
		} catch(err) { next(err) }
}
module.exports.getAllShoppingCarts = async function(req, res, next) {
		try {
			const foundShoppingCarts = await ShoppingCartModel.find({});
				res.json(foundShoppingCarts)
		} catch(err) { next(err) }
}
module.exports.getShoppingCartById = async function(req, res, next) {
		try {
			const shoppingCart = await ShoppingCartModel.findOne({_id: req.params.id}) 
				res.json(shoppingCart)
		} catch(err) { next(err) }
}
module.exports.updateShoppingCartById = async function(req, res, next) { 
		try {
			const updatedShoppingCart = await ShoppingCartModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new:true })
				res.json(updatedShoppingCart)
		} catch(err) { next(err) }
}


module.exports.getShoppingCartByClientRef = async function(req, res, next) {
	try {
		const shoppingCartByUser = await ShoppingCartModel.findOne({ownerRef_id: req.body.client._id})
			res.json(shoppingCartByUser)
	} catch(err) { next(err) }

}

module.exports.pushItemIntoShoppingCart = async function(req, res, next) {
	try {
		const updatedPushedShoppingCart = await ShoppingCartModel.findOneAndUpdate(
			{ ownerRef_id: req.body.client._id }, 
			{ $push: { itemsBought: req.body } },
			{upsert: true, new: true});

			res.json(updatedPushedShoppingCart)
	} catch(err) { next(err) }

}

module.exports.removeItemFromShoppingCart = async function(req, res, next) {
	try{
		const updatedPulledShoppingCart = await ShoppingCartModel.findOneAndUpdate(
			{ ownerRef_id: req.body.client._id }, 
			{ $pull: { itemsBought: { _id: req.body} } },
			{upsert: true, new: true});
	} catch(err) { next(err) }
}
