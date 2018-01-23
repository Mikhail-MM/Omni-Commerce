const mongoose = require('mongoose');
const Schemas = require('../models/schemas/transaction')
const TicketTransaction = Schemas.ticketSchema
const MenuSchema = Schemas.menuSchema
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
	const subTotalBigNumber = arrayOfBigNumberMenuItemPrices.reduce( (acc, curr) => acc.plus(curr))
	const taxRate = new BigNumber(0.07)
	const subTotal = subTotalBigNumber.toNumber()
	const subTotalDisplay = subTotalBigNumber.round(2).toNumber()
	const totalTax = (subTotalBigNumber.times(taxRate)).toNumber()
	const totalTaxDisplay = (subTotalBigNumber.times(taxRate)).round(2).toNumber()
	const total = (subTotalBigNumber.plus(totalTax)).toNumber()
	const totalDisplay = (subTotalBigNumber.plus(totalTax)).round(2).toNumber()
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	Transaction.findOneAndUpdate({_id: req.params.id }, 
		{ subTotalReal: subTotal,
		  subTotal: subTotalDisplay,
		  taxReal: totalTax,
		  tax: totalTaxDisplay,
		  totalReal: total,
		  total: totalDisplay, }, {new: true}, function(err, transaction){
		  	if(err) next(err)
		  	if(!transaction) res.status(404).send("No transaction item with that ID!")
		  	res.json(transaction)
	});
}	


module.exports.createNewTransaction = function(req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	const newTransaction = new Transaction(req.body);
	newTransaction.save(function(err, transaction) {
		if (err) return next(err);
		res.json(transaction);
	})	
}

module.exports.updatePushTransactionById = async function(req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	try {
		const updatedTransactionWithNewSubdoc = await Transaction.findOneAndUpdate(
		{_id: req.params.id}, { $push: { items: req.body } }, { new: true });
			if (!updatedTransactionWithNewSubdoc) return res.status(404).send("No transaction item with that ID!")
		
		req.body.menuItemSubdocs = updatedTransactionWithNewSubdoc.items;		
		next();

	} catch(err) { next(err) }
}

module.exports.pullItemFromArray = async function(req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	console.log("Client requesting subdoc removal")
	console.log("MenuItem _id should be contents of req.body - may need JSON parse")
	console.log(req.body)
	console.log(req.body.subdoc_id)
	try {
		const updatedTransactionWithPulledSubdoc = await Transaction.findOneAndUpdate(
			{_id: req.params.id}, { $pull: { items: { _id: req.body.subdoc_Id } } }, { new: true }); 
			if (!updatedTransactionWithPulledSubdoc) return res.status(404).send("No transaction item with that ID!")
		
		req.body.menuItemSubdocs = updatedTransactionWithPulledSubdoc.items;
		next()
	
	} catch(err) { next(err) }
}

module.exports.pushCustomerAddon = async function(req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	const MenuItem = mongoose.model('MenuItem', MenuSchema, req.headers['x-mongo-key'] + '_MenuItems');
	const addOn = new MenuItem(req.body)
	try{
		const updatedTransactionWithNewAddonSubdoc = await Transaction.findOneAndUpdate(
			{_id: req.params.id}, { $push: { items:addOn } }, { new: true });
			if (!updatedTransactionWithNewAddonSubdoc) return res.status(404).send("No transaction item with that ID!")
		
		req.body.menuItemSubdocs = updatedTransactionWithNewAddonSubdoc.items
		next()

	} catch(err) { next(err) }
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

/* Deprecated in favor of async await + Next() to price calculation 
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
		// For Going to Price Calc: next()
		return res.status(200).send(transaction);
	});
}

module.exports.pullItemFromArray = function (req, res, next) {
	console.log("Client requesting subdoc removal")
	console.log("MenuItem _id should be contents of req.body - may need JSON parse")
	console.log(req.body)
	console.log(req.body.subdoc_id)
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	Transaction.findOneAndUpdate({_id: req.params.id}, { $pull: { items: { _id: req.body.subdoc_Id } } }, { new: true }, 
		function(err, transaction) {
			if(err) return next(err)
			if (!transaction) return res.status(404).send("No transaction item with that ID!")
			return res.status(200).send(transaction)
		})
}


module.exports.pushCustomerAddon = function(req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	const MenuItem = mongoose.model('MenuItem', MenuSchema, req.headers['x-mongo-key'] + '_MenuItems');
	const addOn = new MenuItem(req.body)
	Transaction.findOneAndUpdate({_id: req.params.id}, { $push: { items:addOn } }, { new: true }, 
		function(err, transaction) {
			if(err) next(err)
			if (!transaction) return res.status(404).send("No transaction item with that ID!")
			return res.status(200).send(transaction)
		})


// TODO Push it
}

*/

module.exports.deleteTransactionById = function (req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	Transaction.findOneAndRemove({_id: req.params.id}, function(err, transaction) {
		if (err) return next(err);
		if (!transaction) return res.status(404).send("No transaction item with that ID!");
		return res.status(200).send("Deleted transaction item");
	});
}

