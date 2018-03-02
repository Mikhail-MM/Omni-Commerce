const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var storeConfigSchema = new Schema({
	mongoKey: String,
	loggedInUsers: {type: [String]}
})

module.exports.storeConfigSchema = storeConfigSchema;