const mongoose = require('mongoose');
const MarketplaceModels = require('../models/schemas/marketplace')
const ShoppingCartModel = MarketplaceModels.ShoppingCartModel

module.exports.createShoppingCart = async function(req, res, next) { 
		try {
			const newShoppingCart = new ShoppingCartModel(req.body)
			const savedModel = await newShoppingCart.save()
				res.json(savedModel)
		} catch(err) { next(err) }
}
module.exports.getAllShoppingCarts = async function(req, res, next) {
		try {
			console.log("Getting ALL shopping carts")
			const foundShoppingCarts = await ShoppingCartModel.find({});
				res.json(foundShoppingCarts)
		} catch(err) { next(err) }
}
module.exports.getShoppingCartById = async function(req, res, next) {
		try {
			console.log("Getting shopping cart BY ID!")
			const shoppingCart = await ShoppingCartModel.findOne({_id: req.params.id}) 
				res.json(shoppingCart)
		} catch(err) { next(err) }
}
module.exports.updateShoppingCartById = async function(req, res, next) { 
		try {
			console.log("Looking for shopping cart by ID")
			const updatedShoppingCart = await ShoppingCartModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new:true })
				res.json(updatedShoppingCart)
		} catch(err) { next(err) }
}


module.exports.getShoppingCartByClientRef = async function(req, res, next) {
	try {
		console.log("Looking for Shopping Cart")
		const shoppingCartByUser = await ShoppingCartModel.findOne({ownerRef_id: req.body.client._id})
		console.log("Shopping Cart Found:")
		console.log(shoppingCartByUser)
			res.json(shoppingCartByUser)
	} catch(err) { next(err) }

}

module.exports.pushItemIntoShoppingCart = async function(req, res, next) {
	try {
		console.log("Need to push item into Cart")
		// Check if we already have an instance of the item in the cart, 
		// We can tailor the query to immediately find the entry later
		console.log("Scanning for existing instances of item")
		const shoppingCartByUser = await ShoppingCartModel.findOne({ownerRef_id: req.body.client._id})
		console.log("Single out array of items")
		console.log(shoppingCartByUser.itemsBought)
		console.log("Looking for duplicate items")
		const itemInCartToUpdate = shoppingCartByUser.itemsBought.find(element => element.itemRef_id == req.body.itemRef_id)
		console.log(itemInCartToUpdate)
		if (itemInCartToUpdate) {
			console.log("Existing stock ordered by customer")
			console.log("Additonal stock of existing item user would like to purchase: ")
			const old = parseInt(itemInCartToUpdate.numberRequested, 10)
			console.log(old)
			const notOld = parseInt(req.body.numberRequested, 10)
			console.log(notOld)
			const newAmount = old + notOld
			console.log("New amount:")
			console.log(newAmount)
			console.log("Looking for index of itemsBought array which needs to be replaced")
			const indexToUpdate = shoppingCartByUser.itemsBought.findIndex(element => element.itemRef_id == req.body.itemRef_id)
			console.log(indexToUpdate)
			console.log("Updating amount at index")
			shoppingCartByUser.itemsBought[indexToUpdate].numberRequested = newAmount
			console.log(shoppingCartByUser.itemsBought)
			const replacedShoppingCart = await ShoppingCartModel.findOneAndUpdate({ ownerRef_id: req.body.client._id }, shoppingCartByUser, { new:true })
			return res.json(replacedShoppingCart)
		}
		else if(!itemInCartToUpdate) {
			console.log("No duplicate items found, resuming regular push operation")
		req.body._id = new mongoose.mongo.ObjectId();
		console.log("appending autogen ID to new cart position")
		console.log(req.body)
		const updatedPushedShoppingCart = await ShoppingCartModel.findOneAndUpdate(
			{ ownerRef_id: req.body.client._id }, 
			{ $push: { itemsBought: req.body } },
			{upsert: true, new: true});
		console.log("Shopping Cart Updated")
		console.log(updatedPushedShoppingCart)
			return res.json(updatedPushedShoppingCart)
			}
	} catch(err) { next(err) }

}

module.exports.removeItemFromShoppingCart = async function(req, res, next) {
	try{
		console.log("Attempting to remove item from shopping cart")
		console.log("Req.body should be the ID of itemsBought subdoc")
		console.log(req.body)
		const updatedPulledShoppingCart = await ShoppingCartModel.findOneAndUpdate(
			{ ownerRef_id: req.body.client._id }, 
			{ $pull: { itemsBought: { _id: req.body._id} } },
			{upsert: true, new: true});
		res.json(updatedPulledShoppingCart);
	} catch(err) { next(err) }
}


module.exports.validateCartStock = async function(req, res, next) {
	try {
		const passedItems = [];
		const failedItems = [];
		const flagIfClearForPayment = true; // change to false and attach to response 

	} catch(err) { next(err) }
}