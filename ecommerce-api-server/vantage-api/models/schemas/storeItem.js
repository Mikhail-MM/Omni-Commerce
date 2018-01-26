const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var storeItemSchema = new Schema({
	itemName: String,
	itemPrice: Number,
	imageURL: String,
	category: String,
	options: [String],
	tags: [String],
	inStock: Number,
	inStockBool: Boolean,


})