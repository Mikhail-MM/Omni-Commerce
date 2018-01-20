const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var storeConfigSchema = new Schema({
	mongoKey: String,
	loggedInUsers: {type: [String], default: []}
})

module.exports.storeConfigSchema = storeConfigSchema;