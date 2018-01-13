const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var storeConfigSchema = new Schema({
	mongoKey: String,
	loggedInUsers: [String]
})

module.exports.storeConfigSchema = storeConfigSchema;