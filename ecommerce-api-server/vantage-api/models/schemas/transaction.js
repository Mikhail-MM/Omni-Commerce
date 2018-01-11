const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var menuItemSchema = new Schema({
	itemName: String,
	itemPrice: Number,
	category: String
})

var ticketSchema = new Schema ({
	createdBy: { type: Schema.ObjectId, ref: 'Client'},
	customer: { type: Schema.ObjectId, ref: 'Customer'},
	items: [menuItemSchema],
	status: String // Open, Void, Paid

});

module.exports.menuSchema = menuItemSchema;
module.exports.ticketSchema = ticketSchema;

