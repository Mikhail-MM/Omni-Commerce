const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var clientSchema = new Schema({
	firstName: String,
	lastName: String,
	phoneNumber: String,
	email: {type: String, required: true, unique: true },
	address: String,
	isMaster: { type: Boolean, required: true },
	employeeCounter: Number,
	masterLookupIdentifier: String, // This might just be Organization name to make it easier. Think about scale
	organizationName: String, // Used in the autocomplete to point Employees to the right way
	rosterJob: String,
	ownedBy: String,
	mongoCollectionKey: { type: String, required: true, unique: true }, // use in req.params for POST to route users to proper MongoDB instance
	isAdmin: { type: Boolean, index: true },
	hash: { type:String, required: true },
	token: String,
	clockInNumber: String,
	accountType: String, // Master, Employee, Manager, Terminal
	status: String, // PendingApproval[Pending] - Registered
	master_id: Schema.Types.ObjectId

//	hasChildren: Boolean,
//	children: [ this ]
	},
	{
		toObject:{ getters : true }	//WTF IS THIS still don't understand ;_;
	}
);

clientSchema.methods.comparePassword = function(password, next){
	bcrypt.compare(password, this.hash, function(err, pwMatches){
		if (err) return next(err);
		// null in error position, need to put that there so the next function
		//doesnt run its if(err) clause with whatever the first argument would be
		next(null, pwMatches);
	})
}
//schema.pre validation

var Client = mongoose.model('Client', clientSchema);

module.exports = Client;