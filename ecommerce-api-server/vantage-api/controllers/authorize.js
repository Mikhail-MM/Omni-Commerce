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
				return res.json({token: client.token});
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



exports.routeEmployeeToMongoCollection = function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (!token) return res.status(403).send("Access token required.")
	try { 
		var decoded = jwt.decode(token, config.secret)
	} catch(err) {
		return res.status(403).send("Could not verify access token.")
	}
	Client.findById(decoded._id, function(err, client) {
		if (err) return next(err);
		if (!client) return res.status(403).send("Invalid client.")
		if (token !== client.token)
			return res.status(403).senc("Expired token")
		req.body.client = decoded
		req.headers['x-mongo-key'] = decoded.mongoCollectionKey
		console.log(req.headers)
		next();
	});

};

