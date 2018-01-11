const uuid4 = require('uuid/v4')
const Client = require('../models/schemas/client');



findMasterAndTagChild = function(req, res, next) {
	console.log("looking for Master")
	Client.findOne({
		isMaster: true,
		organizationName: req.body.employerLookup
	}, 
			function(err, client) {
				if (err) return next(err);
				console.log("Found Master:");
				console.log(client);
				console.log("Master's Mongo key:");
				console.log(client.mongoCollectionKey)
				req.body.mongoCollectionKey = client.mongoCollectionKey;
				req.body.organizationName = client.organizationName;
				// create custom fallbacks for not finding organization
				console.log("New req.body:")
				console.log(req.body)
			}).exec().then(() => next())
}


module.exports.configureNewUser = function(req, res, next) {
	if (req.body.isBusinessOwner) {
		req.body.isMaster = true;
		req.body.isAdmin = true;
		// Generate unique identifier for Organization
			const mongoCollectionKey = uuid4().slice(0, 7);
			req.body.mongoCollectionKey = mongoCollectionKey;
			next();
	}

	if (req.body.isEmployee) {
		req.body.isMaster = false;
			findMasterAndTagChild(req, res, next)		
	}
}