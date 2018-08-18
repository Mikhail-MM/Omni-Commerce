const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketplaceSchema = new Schema({
	storeOwnerName: String,
	mongoCollectionKey: String,
	tags: [String],
	ownerRef_id: {type: Schema.Types.ObjectId, ref: 'Client'},
	imageURL: String

});
const storeItemSchema = new Schema({
	itemName: String,
	itemPrice: Number,
	mongoCollectionKey: String,
	imageURL: String,
	description: String,
	postedBy: String,
	category: String, // Consider consolidating with tags
	options: [String],
	tags: [String],
	numberInStock: Number,
	numberRequested: Number, // we NEED to split these shoppingCartOnly values out
	storeOwnerName: String,
	status: String, // inStock/ outOfStock
	sellerRef_id: {type: Schema.Types.ObjectId, ref: 'EssosUser', required: true},
	marketplaceRef_id: {type: Schema.Types.ObjectId, ref: 'Marketplace'},
	itemRef_id: {type: Schema.Types.ObjectId, ref:'StoreItem',}, // only used within shopping cart
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

const stripeCustomerSchema = new Schema({
	id: {type: String, required: true},
	clientRef_id: {type: Schema.Types.ObjectId, ref: 'EssosUser', required: true},
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

const shoppingCartSchema = new Schema(Object.assign({}, salesManifest, {
	ownerRef_id: {type: Schema.Types.ObjectId, ref: 'EssosUser'},
}));

const purchaseOrderSchema = new Schema(Object.assign({}, salesManifest, { 
	buyerRef_id: {type: Schema.Types.ObjectId, ref: 'EssosUser'},
	customerRef_id: {type: Schema.Types.ObjectId, ref: 'StripeCustomer'},
	charge: {type: Schema.Types.Mixed},
}));

const sellerSpecificPurchaseOrder = new Schema(Object.assign({}, salesManifest, {
	sellerRef_id: {type: Schema.Types.ObjectId, ref: 'EssosUser'},
	masterOrderRef_id: {type: Schema.Types.ObjectId, ref: 'PurchaseOrder'},
	customerRef_id: {type: Schema.Types.ObjectId, ref: 'StripeCustomer'},
}));



module.exports.ShoppingCartModel = mongoose.model('ShoppingCart', shoppingCartSchema);
module.exports.MarketplaceModel = mongoose.model('Marketplace', marketplaceSchema);
module.exports.StoreItemModel = mongoose.model('StoreItem', storeItemSchema);
module.exports.StripeCustomerModel = mongoose.model('StripeCustomer', stripeCustomerSchema);
module.exports.PurchaseOrderModel = mongoose.model('PurchaseOrder', purchaseOrderSchema);
module.exports.sellerSpecificPurchaseOrderModel = mongoose.model('SellerShippingOrder', sellerSpecificPurchaseOrder);