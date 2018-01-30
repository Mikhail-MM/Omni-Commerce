const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var marketplaceSchema = new Schema({
	storeName: String,
	ownerName: String,
	mongoKey: String,
	tags: [String],

});


var purchaseOrderSchema = new Schema({

	//buyer: Client Subdoc
	//seller: Client Subdoc
	// Basically populate this with subdocs alongside Shipping and Billing info of receiver
	
});

var storeItemSchema = new Schema({
	itemName: String,
	itemPrice: Number,
	imageURL: String,
	category: String,
	options: [String],
	tags: [String],
	inStock: Number,
	inStockBool: Boolean,
});

var shoppingCart = new Schema({
	itemsBought: [storeItemSchema]
});


module.exports.marketplaceSchema = marketplaceSchema;