const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var timeSheetSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'Client'},
	name: String,
	timeIn: Date,
	timeOut: Date,
	status: String // Clocked In, Clocked Out
})	 

// TODO For Payroll
var timeLog = new Schema({
	hoursWorked: Number,
	overTimeHoursWorked: Number
})

module.exports.timeSheetSchema = timeSheetSchema