const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var menuItemSchema = new Schema({
	itemName: String,
	itemPrice: Number,
	category: String,
	imageURL: String
})

var ticketSchema = new Schema ({
	createdBy: String,
	createdAt: Date,
	customer: String,
	items: [menuItemSchema],
	subTotal:{type: Number, default: 0.00 }, // subTotal is a display value which has been rounded - subtotalReal retains deep float real value
	subTotalReal: Number,
	tax: { type: Number, default: 0.00 },
	taxReal: Number,
	discount: { type: Number, default: 0.00 },
	total: { type: Number, default: 0.00 },
	totalReal: Number,
	payment: {
		paymentType: String, // Cash, Stripe - Card
		cashTenderedByCustomer: String,
		refund: Number,
		stripeAmountInCents: Number,
		captured: Boolean,
		currency: String,
		createdAt: Date,
		description: String,
		stripeCharge_id: String,
		metadata: { 
			parentTransaction_id: 
			{ type: Schema.Types.ObjectId }, },
		outcome: {
			network_status: String,
			reason: String,
			risk_level: String,
			seller_message: String,
			outcomeType: String,
		},
		paid: Boolean,
		refunded: Boolean,
		cardSource: {
			address_city: String,
			address_country: String,
			address_line1: String,
			address_line2: String,
			address_zip: String,
			address_zip_check: String,
			brand: String,
			country: String,
			cvc_check: String,
			exp_month: Number,
			exp_year: Number,
			fingerprint: String,
			funding: String,
			card_id: String,
			last4: String,
			name: String,
			status: String,
		},
	},
	status: String, // Open, Fired, Delivered, Void, Paid
});

var salesReportSchema = new Schema ({
	tickets: [ticketSchema],
	beginDate: Date,
	endDate: Date,
});

module.exports.menuSchema = menuItemSchema;
module.exports.ticketSchema = ticketSchema;
module.exports.salesReportSchema = salesReportSchema

