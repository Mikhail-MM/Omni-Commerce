const Client = require('../models/schemas/client');
const jwt = require('jwt-simple');
const config = require('../models/config');


exports.login = function(req, res, next) {
	if (!req.body.email)
		return res.status(404).send("Please input your Email to log in.");
	if(!req.body.password)
		return res.status(404).send("Please input your Password to log in.");

	Client.findOne({email: req.body.email}, function(err, client){
		if (err) return next(err);
		if(!client) return res.status(404).send("No client with that email");
		client.comparePassword(req.body.password, function(err, pwMatches) {
			if (err) return next(err);
			if (!pwMatches) return res.status(403).send("Invalid Password");
			client.token = null;

			//export secret to config!!
			// TODO: Remove Password Hash from Token!

			var payload = client; 
			
			client.token = jwt.encode(payload, config.secret);

			client.save(function(err){
				if(err) return next(err);
				return res.json({
					token: client.token,
					accountType: client.accountType
				});
			});
		});
	});
};

function validateToken(req, res, next, authReq) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (!token) return res.status(403).send("Access token required.");

	try {
		var decoded = jwt.decode(token, config.secret)
	} catch(err) {
		return res.status(403).send("Could not verify access token.")
	}

	Client.findById(decoded._id, function(err, client) {
		if (err) return next(err);
		if (!client) return res.status(403).send("Invalid client.");
		if (token !== client.token)
			return res.status(403).send("Expired token");
		if (decoded.isAdmin !== client.isAdmin || decoded.isSuperAdmin !== client.isSuperAdmin)
			return res.status(403).send("Expired token");

		if (!client.isAdmin && !client.isSuperAdmin && authReq.adminRequired)
			return res.status(403).send("Admin privileges required");
		if (!client.isSuperAdmin && authReq.superAdminRequired)
			return res.status(403).send("Super Admin privileges required");

		//SUCCESS:

		// This would be the place to have your MongoDB Collections finding info
		req.body.client = decoded
		req.headers['x-mongo-key'] = decoded.mongoCollectionKey
		next();

	});
};

exports.adminRequired = function(req, res, next) {
	console.log("Authorization function running: looking for admin privileges...");
	validateToken(req, res, next, { adminRequired: true });
};

exports.superAdminRequired = function(req, res, next) {
	validateToken(req, res, next, { superAdminRequired: true });
};


exports.routeEmployeeToMongoCollection = async function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	console.log("Routing Employee to Appropriate Mongo Collection")
	console.log("Employee Token:")
	console.log(token)
	if (!token) return res.status(403).send("Access token required.")
	try { 
		var decoded = jwt.decode(token, config.secret)
		console.log("Token Decoded")
		console.log(decoded) 

	} catch(err) {
		return res.status(403).send("Could not verify access token.")
	}
	Client.findById(decoded._id, function(err, client) {
		console.log("Looking for Employee via his _id: Querying Database Now.")
		if (err) return next(err);
		if (!client) return res.status(403).send("Invalid client.")
		if (token !== client.token)
			return res.status(403).send("Expired token")

		console.log("Trying to set req.body.client to decoded value")
		console.log("decoded:")
		console.log(decoded);
		console.log(client);
		req.body.client = client;
		console.log("req.body.client:")
		console.log(req.body.client)
		console.log("Attaching headers to request")
		req.headers['x-mongo-key'] = decoded.mongoCollectionKey
		req.headers['x-user-id'] = decoded._id
		console.log("...headers should be attached, listing all headers:")
		console.log(req.headers)
		next();
	});

};

