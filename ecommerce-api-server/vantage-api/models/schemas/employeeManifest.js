const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeManifestSchema = new Schema({
	userRef: { type: Schema.Types.ObjectId, ref: 'OmniUser' },
	isLoggedIn: Boolean,
})

module.exports.EmployeeManifestSchema = employeeManifestSchema;