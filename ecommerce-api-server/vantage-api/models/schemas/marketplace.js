const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var marketplaceSchema = new Schema({
	storeName: String,
	ownerName: String,
	mongoCollectionKey: String,
	tags: [String],
	ownerRef_id: {type: Schema.Types.ObjectId, ref: 'Client'}

});
var storeItemSchema = new Schema({
	itemName: String,
	itemPrice: Number,
	mongoCollectionKey: String,
	imageURL: String, 
	category: String, // Consider consolidating with tags
	options: [String],
	tags: [String],
	numberInStock: Number,
	status: String, // inStock/ outOfStock
	sellerRef_id: {type: Schema.Types.ObjectId, ref: 'Client'},
	marketplaceRef_id: {type: Schema.Types.ObjectId, ref: 'Marketplace'},
});

// A reusable schema representing transactions in different states and instantiations
const salesManifest = {
	itemsBought: [storeItemSchema],
	subtotal: Number,
	tax: Number,
	total: Number,
}
var purchaseOrderSchema = new Schema(salesManifest);
var shoppingCartSchema = new Schema(salesManifest);
var purchaseOrderSchema = new Schema(Object.assign({}, salesManifest, { additionalField: String }));
var sellerSpecificPurchaseOrder = new Schema(salesManifest)

module.exports.marketplaceSchema = marketplaceSchema;
module.exports.storeItemSchema = storeItemSchema;
module.exports.shoppingCartSchema = shoppingCartSchema;
module.exports.purchaseOrderSchema = purchaseOrderSchema;

