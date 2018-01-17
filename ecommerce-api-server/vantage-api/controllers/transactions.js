const mongoose = require('mongoose');
const Schemas = require('../models/schemas/transaction')
const TicketTransaction = Schemas.ticketSchema
const BigNumber = require('bignumber.js');

//May need exception for creating new transaction
/*
We were using Populate to fill in CreatedBy and Customer by ObjectID reference - switching to simple string identifier and decoupling from Populate Logic
module.exports.createNewTransactionAndPopulate = function(req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	var newTransaction = new Transaction(req.body);
	 newTransaction.save(function(err, transaction) {
	   if (err) return next(err);
		// Before We added Populating, simply sent: res.send(transaction);
		  return transaction;
		 }).
	 		then(function(transaction){
		       Transaction.
		         findOne({ _id: transaction._id }).
		         populate('createdBy', 'email phone').
		         populate('items').
		         exec(function (err, populatedTransaction) {
		         	if (err) return next(err);
		         	res.send(populatedTransaction)
		         });
		         //May want to move this to middleware, possibly...
		         // TODO: Need to send Client _id on transaction creation when clicking "New Transaction" button. Use localStorage Access token -> Decryption? Requires an extra auth route, but this is OK! 
});
}
*/

module.exports.calculatePricing = function(req, res, next) {
	const arrayOfBigNumberMenuItemPrices = req.body.menuItemSubdocs.map(subdoc => new BigNumber(subdoc.itemPrice))
	console.log("Array of (BigNumber) Menu Item Prices:")
	console.log(arrayOfBigNumberMenuItemPrices)
	const subTotal = arrayOfBigNumberMenuItemPrices.reduce( (acc, curr) => acc.plus(curr))
	console.log("SubTotal price of Transaction:") 
	console.log(subTotal)
	console.log("typeOf subtotal:")
	console.log(typeof(subTotal))
	console.log("Coverting to String")
	console.log(subTotal.toNumber())
}	


module.exports.createNewTransaction = function(req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	const newTransaction = new Transaction(req.body);
	newTransaction.save(function(err, transaction) {
		if (err) return next(err);
		res.json(transaction);
	})	
}
module.exports.getTransactionById = function (req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	Transaction.findOne({_id: req.params.id}, function(err, transaction) {
		if (err) return next(err)
		 if(!transaction) return res.status(404).send("Could not locate transaction with ID " + req.params.id);
		  return res.json(transaction);
	});
}

module.exports.getAllTransactions = function (req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	Transaction.find({}, function(err, transactions) {
		if (err) return next(err);
		 if (!transactions) return res.status(404).send("Could not locate any transaction Items in database");
		  return res.json(transactions);
	});
}

module.exports.updateTransactionById = function (req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	Transaction.findOneAndUpdate({_id: req.params.id}, req.body, 
		{ new: true }, function(err, transaction) {
		 if (err) return next(err);
		  if (!transaction) return res.status(404).send("No transaction item with that ID!")
		   console.log(req.body);
		    return res.status(200).send(transaction);
	});
}

module.exports.updatePushTransactionById = function (req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	console.log(req.body);
	Transaction.findOneAndUpdate({_id: req.params.id}, { $push: { 
		items: req.body}
	}, 
		{ new: true }, function(err, transaction) {
		if (err) return next(err);
		if (!transaction) return res.status(404).send("No transaction item with that ID!")
		req.body.menuItemSubdocs = transaction.items
		console.log("Loading array of menu items from transaction body into req.body.menuItemSubdocs for payment processing")
		console.log(req.body.menuItemSubdocs);
		next()
		// MOVE TO TOP return res.status(200).send(transaction);
	});
}

module.exports.deleteTransactionById = function (req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	Transaction.findOneAndRemove({_id: req.params.id}, function(err, transaction) {
		if (err) return next(err);
		if (!transaction) return res.status(404).send("No transaction item with that ID!");
		return res.status(200).send("Deleted transaction item");
	});
}

