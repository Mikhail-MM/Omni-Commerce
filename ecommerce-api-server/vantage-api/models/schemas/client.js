const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var clientSchema = new Schema({
	firstName: String,
	lastName: String,
	userName: String,
	phoneNumber: String,
	email: {type: String, required: true, unique: true },
	billing_address_line1: String,
	billing_address_line2: String,
	billing_address_city: String,
	billing_address_zip: String,
	billing_address_state: String,
	shipping_address_line1: String,
	shipping_address_line2: String,
	shipping__address_city: String,
	shipping_address_zip: String,
	shipping_address_state: String,
	isMaster: Boolean,
	masterSubscriptionApproved: Boolean,
	employeeApproved: Boolean,
	employeeCounter: Number,
	masterLookupIdentifier: String, // This might just be Organization name to make it easier. Think about scale
	organizationName: String, // Used in the autocomplete to point Employees to the right way
	rosterJob: String,
	mongoCollectionKey: { type: String, required: true },
	isAdmin: { type: Boolean, index: true },
	hash: { type: String, required: true },
	token: String,
	clockInNumber: String,
	accountType: String, 
	status: String, // PendingApproval[Pending] - Registered
	master_id: { type: Schema.Types.ObjectId, ref: 'Client' },
	marketplaceRef_id: { type: Schema.Types.ObjectId, ref: 'Marketplace' }
	},
	{
		toObject:{ getters : true }	
	}
);

clientSchema.methods.comparePassword = function(password, next){
	bcrypt.compare(password, this.hash, function(err, pwMatches){
		if (err) return next(err);
		next(null, pwMatches);
	})
}
var Client = mongoose.model('Client', clientSchema);

module.exports = Client;