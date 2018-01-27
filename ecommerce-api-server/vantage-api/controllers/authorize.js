const Client = require('../models/schemas/client');
const jwt = require('jwt-simple');
const config = require('../models/config');


exports.login = function(req, res, next) {
	//ensure user included an email/username credential in the request, otherwise return 404
	
	//it may be wise to tell our guests to login with something other than their email
	console.log(req.body);
	if (!req.body.email)
		return res.status(404).send("Please input your Email to log in.");
	//ensure user included an password credential in the request, otherwise return 404
	if(!req.body.password)
		return res.status(404).send("Please input your Password to log in.");

	Client.findOne({email: req.body.email}, function(err, client){
		if (err) return next(err);
		if(!client) return res.status(404).send("No client with that email");
		//program crashes server if duplicate emails are found

		client.comparePassword(req.body.password, function(err, pwMatches) {
			if (err) return next(err);
			if (!pwMatches) return res.status(403).send("Invalid Password");
			console.log("We have found the client with that Password and username: " + client);
			
			client.token = null;

			//export secret to config!!

			var payload = client; 
			// Payload should just be clientID WITHOUT hashed PW!!!!

			//Is there an advantage to  doing
			// var token = jwt.encode(payload, config.secret);
			// user.token = token;
			//Like am I jumping the gun by going straight to client.token and saving it?? Not sure..
			
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
			return res.status(403).senc("Expired token")


		req.body.client = decoded
		console.log("req.body.client:")
		console.log(req.body.client)
		console.log("Attaching headers to request")
		req.headers['x-mongo-key'] = decoded.mongoCollectionKey
		console.log("...headers should be attached, listing all headers:")
		console.log(req.headers)
		next();
	});

};

