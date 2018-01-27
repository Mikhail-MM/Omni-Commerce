const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var marketplaceSchema = new Schema({
	storeName: String,
	ownerName: String,
	tags: [String],

});

module.exports.marketplaceSchema = marketplaceSchema;