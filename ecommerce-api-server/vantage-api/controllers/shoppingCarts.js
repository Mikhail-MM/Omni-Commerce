const mongoose = require('mongoose');
const MarketplaceModels = require('../models/schemas/marketplace')
const ShoppingCartModel = MarketplaceModels.ShoppingCartModel
const StoreItemModel = MarketplaceModels.StoreItemModel
const BigNumber = require('bignumber.js');

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
				req.body.shoppingCartSubdocs = updatedShoppingCart;
				next();
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
			req.body.shoppingCartSubdocs = replacedShoppingCart.itemsBought;
			next()
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
		req.body.shoppingCartSubdocs = updatedPushedShoppingCart.itemsBought
		next()
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
		req.body.shoppingCartSubdocs = updatedPulledShoppingCart
		next()
	} catch(err) { next(err) }
}


module.exports.validateCartStock = async function(req, res, next) {
	try {
		// Preliminary validation which will remove any items from the cart which would cause stock to decrease below zero
		// This will involve heavy Querying against all items in the DB
		// Need an algorithm to return a new cart which has had all items which would have stocks overflow REPLACED
		// If there is a discrepancy, simply replace the Amount Requested within the Shopping Cart
		// Witht he Stock Available 
		const response = {}
		const passedItems = [];
		const failedItems = [];
		const partialValidationFail = false; // change to false and attach to response 
		const shoppingCartByUser = await ShoppingCartModel.findOne({ownerRef_id: req.body.client._id})
		shoppingCartByUser.itemsBought.forEach(cartItem => {
			const merchantStock = await StoreItemModel.findOne({_id: cartItem.itemRef_id})
			if (cartItem.numberRequested >= merchantStock.numberInStock) { passedItems.push(cartItem) }
				// Improve this else-if method to reconcile :: use the method we used in our action dispatch last night to automatically adjust cart
			// AND update it in the DB
			else if (cartItem.numberRequested < merchantStock.numberInStock) { failedItems.push(cartItem) }
		})
		if (failedItems.length > 0) {partialValidationFail = true}
			// Update ShoppingCart with new Items Bought
		response.passedItems = passedItems
		respones.failedItems = failedItems
		response.partialValidationFail = partialValidationFail
		res.json(response)



	} catch(err) { next(err) }
}

module.exports.calculatePricing = async function(req, res, next) {
	const bigNumberPriceRequest = req.body.shoppingCartSubdocs.map(item => {
		return { 
			itemPrice: new BigNumber(item.itemPrice),
			multipleRequest: new BigNumber(item.numberRequested),
		}
	});
	const subTotalBigNumber =  bigNumberPrices.reduce( (acc, cur, index, array) => { 
		return acc.plus((cur.itemPrice.times(cur.multipleRequest))) }, bigNumberPriceRequest[0].itemPrice.times(bigNumberPriceRequest.multipleRequest)
	)
	const taxRate = new BigNumber(0.07) // outsource taxrate const to config
	const subtotalReal = subTotalBigNumber.toNumber(),
	const subtotalDisplay = subTotalBigNumber.round(2).toNumber(),
	const taxReal = subTotalBigNumber.times(taxrate).toNumber(),
	const taxDisplay = subTotalBigNumber.times(taxRate).round(2).toNumber(),
	const totalReal = subTotalBigNumber.plus(taxReal).toNumber()
	const totalDisplay = subTotalBigNumber.plus(taxReal).round(2).toNumber()

	const priceField = {
		subtotalReal: subtotalReal,
		subtotalDisplay: subtotalDisplay,
		taxReal: taxReal,
		taxDisplay: taxDisplay,
		totalReal: totalReal,
		totalDisplay: totalDisplay,
	}
	const updatedPricesShoppingCart = await ShoppingCartModel.findOneAndUpdate({ownerRef_id: req.body.client._id}, priceField, {new: true})
	res.json(updatedPricesShoppingCart)
}