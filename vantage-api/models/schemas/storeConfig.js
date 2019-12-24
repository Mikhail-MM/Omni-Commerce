const mongoose = require('mongoose');

const { Schema } = mongoose;

const storeConfigSchema = new Schema({
  mongoKey: String,
  loggedInUsers: { type: [String] },
});

module.exports.storeConfigSchema = storeConfigSchema;
