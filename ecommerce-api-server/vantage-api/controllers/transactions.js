const mongoose = require('mongoose');
const Schemas = require('../models/schemas/transaction')
const TicketTransaction = Schemas.ticketSchema

//May need exception for creating new transaction
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
		console.log(req.body);
		return res.status(200).send(transaction);
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

