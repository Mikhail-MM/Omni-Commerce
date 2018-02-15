const mongoose = require('mongoose')
const Schema = mongoose.Schema

//These can be used in salesReports
const invoiceSchema = new Schema({
	invoiceType: { type: String, required: true },
	date: { type: Date, required: true },
	contents: [
		purchase: { type: String, required: true }
		quantity: { type: Number, required: true, default: 1 }
		subtotal: { type: Number, required: true }
		tax: { type: Number, required: true, default: 0 }
		total: { type: Number, required: true }
	],
	totalExpense: { type: Number, required: true },
})

module.exports.invoiceModel = mongoose.model('Invoice', invoiceSchema);