const mongoose = require('mongoose');

const { Schema } = mongoose;

const employeeManifestSchema = new Schema({
  userRef: { type: Schema.Types.ObjectId, ref: 'OmniUser' },
  isLoggedIn: Boolean,
});

module.exports.EmployeeManifestSchema = employeeManifestSchema;
