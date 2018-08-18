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
		console.log("Scanning for existing instances of item within shopping cart")
		const shoppingCartByUser = await ShoppingCartModel.findOne({ownerRef_id: req.body.client._id})
		console.log("Single out array of items")
		console.log(shoppingCartByUser.itemsBought)
		console.log("Looking for duplicate items - may be undefined if not found")
		const itemInCartToUpdate = shoppingCartByUser.itemsBought.find(element => element.itemRef_id == req.body.itemRef_id)
		console.log(itemInCartToUpdate)
		if (itemInCartToUpdate) {
			console.log("Amount already in cart")
			const old = parseInt(itemInCartToUpdate.numberRequested, 10)
			console.log(old)
			console.log("Amount customer wants to add with this request")
			const notOld = parseInt(req.body.numberRequested, 10)
			console.log(notOld)
			const newAmount = old + notOld
			console.log("New Combine Amount")
			console.log(newAmount)
			console.log("Looking for index of itemsBought array which needs to be replaced")
			const indexToUpdate = shoppingCartByUser.itemsBought.findIndex(element => element.itemRef_id == req.body.itemRef_id)
			console.log(indexToUpdate)
			console.log("Updating amount at index and logging entire new entry")
			shoppingCartByUser.itemsBought[indexToUpdate].numberRequested = newAmount
			console.log(shoppingCartByUser.itemsBought)
			const replacedShoppingCart = await ShoppingCartModel.findOneAndUpdate({ ownerRef_id: req.body.client._id }, shoppingCartByUser, { new:true })
			req.body.shoppingCartSubdocs = replacedShoppingCart.itemsBought;
			console.log("Moving on to calculate prices")
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
		req.body.shoppingCartSubdocs = updatedPulledShoppingCart.itemsBought
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

		var response = {}
		var passedItems = [];
		var failedItems = [];
		var partialValidationFail = false; // change to false and attach to response 
		console.log("Secondary Validation of cart stock against items on DB")
		const shoppingCartByUser = await ShoppingCartModel.findOne({ownerRef_id: req.body.client._id})
		
		for (const cartItem of shoppingCartByUser.itemsBought) { 
				console.log("Running ForEach - Looking for requested cartItem listing within DB:")
				const merchantStock = await StoreItemModel.findOne({_id: cartItem.itemRef_id}, '-_id')
				console.log(merchantStock)
				console.log("# in Customer Cart")
				const numRequested = parseInt(cartItem.numberRequested, 10)
				console.log(numRequested)
				console.log("# stocked by merchant")
				const inStock = parseInt(merchantStock.numberInStock, 10)
				console.log(inStock)

				if (numRequested <= inStock) { 
					// better to use an array of object and concat I guess
					console.log("if statement running: Number Requested is Less than or Equal to amount in stock by merchant")
					console.log("Pushing cartItem into passedItems array - logging passedItems array")
					passedItems.push(cartItem) 
					console.log(passedItems)
				}
					else if (numRequested > inStock) { 
						console.log("else If statement running: number requested exceeds amount in stock")
						console.log("Reconciling - determining amountThatCanBeFulfilled:")

						var amountThatCanBeFulfilled = inStock
						console.log(amountThatCanBeFulfilled)
						if (amountThatCanBeFulfilled == 0) { 
							console.log("nested if within else if running:")
							console.log("Amount that can be fulfilled is ZERO...")
							console.log("Pushing entire cartItem to failedItems array - logging failedItems array")
							failedItems.push(cartItem) 
							console.log(failedItems)
						}
						else if (amountThatCanBeFulfilled > 0) {
							console.log("Nested else if within else if statement:")
							console.log("Amount that can be fulfilled is greater than zero")
							console.log("Calculating how much is unfulfillable (amount requested - amount that can be fulfilled) - logging unfulfillable")
							const unfulfillable = numRequested - amountThatCanBeFulfilled
							console.log(unfulfillable)
							// Doing a Direct Mutation here - not sure if that's great
							// Unfulfillable Portion
							console.log("Doing a mutation type thing now")
							console.log("Setting cartItem.numberRequested to unfulfillable - pushing a partial invalidation to failed Items - logging failed items")
							cartItem.numberRequested = unfulfillable
							failedItems.push(cartItem) 
							console.log(failedItems)
							// Fulfillable
							console.log("Setting cartItem.numberRequested to amountThatCanbeFulfilled - pushing cartItem as partial validation to passedItems - logging passed items")
							cartItem.numberRequested = amountThatCanBeFulfilled
							passedItems.push(cartItem)
							console.log(passedItems)
						}
					}
		}

		if (failedItems.length > 0) {
			console.log("Evaluate length of failedItems - If it has any invalidations, flip flag to notify front-end")
			partialValidationFail = true
		}
			// Update ShoppingCart with new Items Bought
		
		response.passedItems = passedItems;
		response.failedItems = failedItems;
		response.partialValidationFail = partialValidationFail;

		console.log("Updating cart - replacing itemsBought array with all items that are within passedItems array");
		const validatedCart = await ShoppingCartModel.findOneAndUpdate({ownerRef_id: req.body.client._id}, {$set: { itemsBought: passedItems } }, {new: true});
		console.log("New Cart:")
		console.log(validatedCart)
		response.validatedCart = validatedCart;
		//res.json(response)
		req.body.validation = response;
		req.body.shoppingCartSubdocs = validatedCart.itemsBought;
		console.log("Logging Response, which should contain PassedItems/FailedItems as well as our entire validated cart")
		console.log(response);
		console.log("Here is validatedCart.itemsBought:")
		console.log(validatedCart.itemsBought)
		console.log("Proceeding to Price Calculation...")
		next()


	} catch(err) { next(err) }
}


module.exports.validateMarketplacePayment = async function (req, res, next) {
    // Before running this, save a Stripe customer to charge later (we may need to save this into a DB, saving his shopping cart ref (Basically just a foreign key))
    // We will need to have a DECREMENT step - Create an array to store the History of Queries so that we can go and increment all items that fail validation.
    // The final test is this:
    // If the 3 step validation works - If the DECREMENTED ITEM LISTING IN THE DB has a STOCK of >=0, that shopping cart entry can be fulfilled and added to a purchase order
    // If not, We must return the decrement
    // If you want to still charge for as many items as possible, we will actually need recursion to reconcile the fulfillable amount, -
    // Reverse the first decrement
    // Query for the item's new, actual stock (since someone bought some to make this previously valid order invalid)
    // Change the amount requested within the shopping cart
    // Initialize validation again - and repeat if fails (and if stock is > 0)

    // To make this easier/less ugly, we may want to make a retryValidation function. 
    // Also, we can create an object const currentTarget {} instead of using longhand Array of Objects a certain index with certain key - just currentTarget.itemsBought - but doesnt matter rly

    // All Items that pass 3 step validation can be turned into a general purchase order for the buyer/server as a receipt
    // All items that fail are sent back to the thunk handler
    // A flag in the constructed response will determine whether to send invalidated item message

    // From here, splitting the Purchase Order will be simple enough. We will need a ref to the parent purchase order in each child, and each child is a seller-specific order that is sent
    // to the marketplace ref (essentially the client ref) as an ID
		var response = {}
		var passedItems = [];
		var failedItems = [];
		var oldStoreItems = []; // Development Only
		var newStoreItems = []; // Development Only
		var partialValidationFail = false; // change to false and attach to response 
		

		const shoppingCartByUser = await ShoppingCartModel.findOne({ownerRef_id: req.body.client._id})
		
		if (shoppingCartByUser.itemsBought.length === 0) {
			res.status(409).send("User sent empty shopping cart.")
		}

		for (const cartItem of shoppingCartByUser.itemsBought) {
			console.log("Find Item Listing from Cart Within DB - Saving in Cache")			
			const merchantStock = await StoreItemModel.findOne({_id: cartItem.itemRef_id}, '-_id');
				oldStoreItems.push(merchantStock)
			const numRequested = parseInt(cartItem.numberRequested, 10)
			const inStock = parseInt(merchantStock.numberInStock, 10)
			console.log("Items Requested by User, SKU In-Stock", numRequested, inStock)
			if (numRequested <= inStock) { 
					console.log("Merchant can fulfill full order.")
					passedItems.push(cartItem)
					console.log("Updating merchant SKU")
					const newStock = inStock - numRequested
						// This should be done later
						const updatedMerchantStock = await StoreItemModel.findOneAndUpdate({_id: cartItem.itemRef_id}, {numberInStock: newStock}, {new: true})

				newStoreItems.push(updatedMerchantStock)
			}
				else if (numRequested > inStock) { 
					console.log("Merchant unable to fulfill full order")
					if (inStock === 0) { 
						console.log("Merchant Stock Empty")
						newStoreItems.push(merchantStock)
						failedItems.push(cartItem) 
					}
					else if (inStock > 0) {

						const unfulfillableCount = numRequested - inStock

						console.log("Merchant fulfilling partial order")
						
						const partialOrderFulfillent = {...cartItem, numberRequested: inStock }
						const discardedOrderPortion = {...cartItem, numberRequested: unfulfillable}
						

						failedItems.push(unfulfillableObject) 
						passedItems.push(partialOrderFulfillent)

						const updatedMerchantStock = await StoreItemModel.findOneAndUpdate({_id: cartItem.itemRef_id}, {numberInStock: 0}, {new: true})
						newStoreItems.push(updatedMerchantStock)
					}
				}
		}
		if (failedItems.length > 0) {partialValidationFail = true}
			// Update ShoppingCart with new Items Bought
		response.passedItems = passedItems
		response.failedItems = failedItems
		response.partialValidationFail = partialValidationFail

		const validatedCart = await ShoppingCartModel.findOneAndUpdate({ownerRef_id: req.body.client._id}, {$set: {itemsBought: passedItems } }, {new: true}) // Prices Not Updated - be aware - outsource full update til later
		
		response.validatedCart = validatedCart
		response.oldStoreItems = oldStoreItems
		response.newStoreItems = newStoreItems
		console.log(response);
		console.log("Here is validatedCart.itemsBought:")
		console.log(validatedCart.itemsBought)
		console.log("Proceeding to Price Calculation...")

		//res.json(response)
		req.body.validatedPurchaseOrderToProcess = response;
		req.body.shoppingCartSubdocs = validatedCart.itemsBought; // could be passedItems and do full shopping cart update later - feels weird to update items separately from prices
		next()
  }

module.exports.test = async function(req, res, next) {
	const array = [ShoppingCartModel.find({}).exec(), ShoppingCartModel.find({}).exec()]
	console.log(array)
	const promise = await Promise.all(array)
	console.log(promise)
	res.json(promise)
}

module.exports.calculatePricing = async function(req, res, next) {
	const bigNumberPrices = req.body.shoppingCartSubdocs.map(item => {
		return { 
			itemPrice: new BigNumber(item.itemPrice),
			multipleRequest: new BigNumber(item.numberRequested),
		}
	});

	const subTotalBigNumber =  bigNumberPrices.reduce( (acc, cur) => { 

		return acc.plus((cur.itemPrice.times(cur.multipleRequest))) }, new BigNumber(0)
	)

	
	const taxRate = new BigNumber(0.07) // outsource taxrate const to config
	const subtotalReal = subTotalBigNumber.toNumber()
	const subtotalDisplay = subTotalBigNumber.round(2).toNumber()
	const taxReal = subTotalBigNumber.times(taxRate).toNumber()
	const taxDisplay = subTotalBigNumber.times(taxRate).round(2).toNumber()
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
	console.log("Logging priceField and appending to shopping cart via findOneAndUpdate")
	console.log(priceField)
	console.log("Checking shopping cart on deck")
	const shoppingCartBeforeUpdate = await ShoppingCartModel.findOne({ownerRef_id: req.body.client._id})
	console.log(shoppingCartBeforeUpdate)
	const updatedPricesShoppingCart = await ShoppingCartModel.findOneAndUpdate({ownerRef_id: req.body.client._id}, priceField, {new: true})
	console.log("logging updated shopping cart after price calculations")
	console.log(updatedPricesShoppingCart)
	console.log("Figuring out why itemsBought disappeared")
	console.log(updatedPricesShoppingCart.itemsBought)
		if (req.body.validation) { 
			req.body.validation.validatedCart = updatedPricesShoppingCart
			return res.json(req.body.validation)
		} else if (req.body.validatedPurchaseOrderToProcess) {
			req.body.validatedPurchaseOrderToProcess.validatedCart = updatedPricesShoppingCart
			next()
		} else{ return res.json(updatedPricesShoppingCart) }
		
		
}