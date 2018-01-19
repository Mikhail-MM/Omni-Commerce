const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var menuItemSchema = new Schema({
	itemName: String,
	itemPrice: Number,
	category: String
})

var ticketSchema = new Schema ({
	createdBy: String,
	createdAt: Date,
	customer: String,
	items: [menuItemSchema],
	subTotal: Number,
	tax: Number,
	discount: Number,
	total: Number,
	status: String // Open, Fired, Delivered, Void, Paid

});

module.exports.menuSchema = menuItemSchema;
module.exports.ticketSchema = ticketSchema;

