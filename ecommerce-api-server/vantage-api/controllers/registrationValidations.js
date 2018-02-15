const Validation = require('../models/schemas/registrationValidation')
const Client = require('../models/schemas/client');
const uuid4 = require('uuid/v4');
const ValidationModel = Validation.registrationValidation

module.exports.resetPassword = async function(req, res, next) {
	const lostAccount = await Client.findOne({email: req.body.email})
	if (!lostAccount) return res.status(404)
	// TODO: integrate with NodeMailer
	// Send Create sliced validation code, save to Validation DB 
}