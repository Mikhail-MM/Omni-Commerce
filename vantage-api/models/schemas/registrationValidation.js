const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrationValidationSchema = new Schema({
	type: String,
	accessCode: String,
	clientRef: { type: Schema.Types.ObjectId, ref: 'Client' }
})

const registrationValidationModel = mongoose.model('RegistrationValidation', registrationValidationSchema)

module.exports.registrationValidation = registrationValidationModel;