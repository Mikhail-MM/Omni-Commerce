const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const omniUserSchema = new Schema({
	email: {type: String, required: true, unique: true },
	hash: { type: String, required: true },
	accountType: String,

	isMaster: Boolean,
	master_id: { type: Schema.Types.ObjectId, ref: 'OmniUser' },

	mongoCollectionKey: { type: String, required: true },

	teminalIDNumber: Number,
	 	
	isAdmin: { type: Boolean, index: true },
	
	employeeCounter: Number,
	
	token: String,
	tokenCreatedAt: Date,
	},
	{
		toObject:{ getters : true }	
	}
);

const essosUserSchema = new Schema({
	email: {type: String, required: true, unique: true },
	hash: { type: String, required: true },
	
	accountType: String,
	
	firstName: String,
	lastName: String,
	phoneNumber: String,
	
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

	mongoCollectionKey: { type: String, required: true },

	token: String,
	tokenCreatedAt: Date,

	marketplaceRef_id: { type: Schema.Types.ObjectId, ref: 'Marketplace' }
	},
	{
		toObject:{ getters : true }	
	}
);

const verifyPassword = (password, next) => {
		bcrypt.compare(password, this.hash, (err, pwMatches) => {
		if (err) return next(err);
		next(null, pwMatches);
	})
}

omniUserSchema.methods.comparePassword = verifyPassword;
essosUserSchema.methods.comparePassword = verifyPassword;

module.exports.OmniUser = mongoose.model('OmniUser', omniUserSchema);
module.exports.EssosUser = mongoose.model('EssosUser', essosUserSchema);


