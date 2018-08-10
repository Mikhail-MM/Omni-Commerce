const Client = require('../models/schemas/client');

const Users = require('../models/schemas/users');
const OmniUser = Users.OmniUser;

module.exports.findMyEmployees = async function(req, res, next) {
	try {
		console.log("Looking for employees")
		const myEmployees = await OmniUser.find({mongoCollectionKey: req.headers['x-mongo-key']})
		if (!myEmployees) return res.status(404).send("Could not find any employees in this organization")
		res.json(myEmployees)
	} catch(err) { next(err) }
}

module.exports.approveEmployeeSignUp = async function(req, res, next) {
	try {
		const employeeToUpdate = await Client.findOneAndUpdate({_id: req.body._id}, {employeeAuthorization: true}, {new: true})
		if (!employeeToUpdate) return res.status(404).send("Could not find the employee you were looking for")
		res.json(employeeToUpdate)
	} catch(err) { next(err) }
}

module.exports.disableEmployeeAccess = async function(req, res, next) {
	try {
		const employeeToUpdate = await Client.findOneAndUpdate({_id: req.body._id}, {employeeAuthorization: false}, {new: true})
		if (!employeeToUpdate) return res.status(404).send("Could not find the employee you were looking for")
		res.json(employeeToUpdate)
	} catch(err) { next(err) }
}

module.exports.approveEmployeeManagementAdminPermissions = async function(req, res, next) {
	try {
		const employeeToUpdate = await Client.findOneAndUpdate({_id: req.body._id}, {isAdmin: true}, {new: true})
		if (!employeeToUpdate) return res.status(404).send("Could not find the employee you were looking for")
		res.json(employeeToUpdate)
	} catch(err) { next(err) }
}

module.exports.disableEmployeeManagementAdminPermissions = async function(req, res, next) {
	try {
		const employeeToUpdate = await Client.findOneAndUpdate({_id: req.body._id}, {isAdmin: false}, {new: true})
		if (!employeeToUpdate) return res.status(404).send("Could not find the employee you were looking for")
		res.json(employeeToUpdate)
	} catch(err) { next(err) }
}


module.exports.sendPrivateEmployeeInvitation = async function(req, res, next) {
	try {
		// TODO: Create UUID to be used in QueryString for Private Invitation Screen on front screen
		// Run Functions to establish Clock-In numbers and update Admin employee count

		const data = {
			lastName: req.body.lastName,
			userName: req.body.firstName,
			phoneNumber: req.body.phoneNumber,
			email: req.body.email,
			isMaster: false,
			employeeApproved: true,
			organizationName: req.body.client.organizationName,
			mongoCollectionKey: req.body.client.mongoCollectionKey,
			isAdmin: false,
			master_id: req.body.client._id

		}

		// TODO: Run through registration configuration functions in controllers/registration.js
		// TODO: Give employee validation code via uuidv4, save to DB, and use NodeMailer to send employee a specific registration email with queryString to include the access code for access to private registration route

	} catch(err) { next(err) }

}

