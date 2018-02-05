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
	numberRequested: Number, // we NEED to split these shoppingCartOnly values out
	status: String, // inStock/ outOfStock
	sellerRef_id: {type: Schema.Types.ObjectId, ref: 'Client'},
	marketplaceRef_id: {type: Schema.Types.ObjectId, ref: 'Marketplace'},
	itemRef_id: {type: Schema.Types.ObjectId, ref:'StoreItem'}, // only used within shopping cart
});

// A reusable schema representing transactions in different states and instantiations
const salesManifest = {
	itemsBought: [storeItemSchema],
	subtotalReal: Number,
	subtotalDisplay: Number,
	taxDisplay: Number,
	taxReal: Number,
	totalReal: Number,
	totalDisplay: Number,
}

var stripeCustomerSchema = new Schema({
	id: {type: String, required: true},
	clientRef_id: {type: Schema.Types.ObjectId, ref: 'Client', required: true},
	created: Date,
	account_balance: Number,
	currency: String,
	description: String,
	email: String,
	livemode: Boolean,
	metadata: {type: Schema.Types.Mixed},
	shipping: {
		address: {
			city: String,
			country: String,
			line1: String,
			line2: String,
			postal_code: String,
			state: String,
		},
		name: String,
		phone: String,
	},
	sources: {
		object: String,
		data: [],
		has_more: Boolean,
		url: String,

	},
	subscriptions: {
		object: String,
		data: [Schema.Types.Mixed],
		has_more: Boolean,
		url: String,
	},
})

var shoppingCartSchema = new Schema(Object.assign({}, salesManifest, {
	ownerRef_id: {type: Schema.Types.ObjectId, ref: 'Client'},
}));

var purchaseOrderSchema = new Schema(Object.assign({}, salesManifest, { 
	buyerRef_id: {type: Schema.Types.ObjectId, ref: 'Client'},
	customerRef_id: {type: Schema.Types.ObjectId, ref: 'StripeCustomer'},
	charge: {type: Schema.Types.Mixed},
}));

var sellerSpecificPurchaseOrder = new Schema(Object.assign({}, salesManifest, {
	ownerRef_id: {type: Schema.Types.ObjectId, ref: 'Client'},
}));

module.exports.marketplaceSchema = marketplaceSchema;
module.exports.storeItemSchema = storeItemSchema;
module.exports.shoppingCartSchema = shoppingCartSchema;
module.exports.stripeCustomerSchema = stripeCustomerSchema;
module.exports.purchaseOrderSchema = purchaseOrderSchema;
const ShoppingCartModel = mongoose.model('ShoppingCart', shoppingCartSchema)
const MarketplaceModel = mongoose.model('Marketplace', marketplaceSchema)
const StoreItemModel = mongoose.model('StoreItem', storeItemSchema)
const StripeCustomerModel = mongoose.model('StripeCustomer', stripeCustomerSchema)
const PurchaseOrderModel = mongoose.model('PurchaseOrder', purchaseOrderSchema)
module.exports.ShoppingCartModel = ShoppingCartModel;
module.exports.MarketplaceModel = MarketplaceModel;
module.exports.StoreItemModel = StoreItemModel;
module.exports.StripeCustomerModel = StripeCustomerModel;
module.exports.PurchaseOrderModel = PurchaseOrderModel;