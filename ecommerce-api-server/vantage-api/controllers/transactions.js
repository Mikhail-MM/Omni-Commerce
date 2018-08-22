const mongoose = require('mongoose');
const Schemas = require('../models/schemas/transaction')
const TicketTransaction = Schemas.ticketSchema
const MenuSchema = Schemas.menuSchema
const BigNumber = require('bignumber.js');

const events = require('./events')



module.exports.calculatePricing = async function(req, res, next) {
	const arrayOfBigNumberMenuItemPrices = req.body.menuItemSubdocs.map(subdoc => new BigNumber(subdoc.itemPrice))
	const subTotalBigNumber = arrayOfBigNumberMenuItemPrices.reduce( (acc, curr) => acc.plus(curr))
	const taxRate = new BigNumber(0.07)
	const subTotal = subTotalBigNumber.toNumber()
	const subTotalDisplay = subTotalBigNumber.round(2).toNumber()
	const totalTax = (subTotalBigNumber.times(taxRate)).toNumber()
	const totalTaxDisplay = (subTotalBigNumber.times(taxRate)).round(2).toNumber()
	const total = (subTotalBigNumber.plus(totalTax)).toNumber()
	const totalDisplay = (subTotalBigNumber.plus(totalTax)).round(2).toNumber()
	
	const TransactionModel = mongoose.model('Transaction', TicketTransaction, 'Transactions_' + req.headers['x-mongo-key'])
	
	const updatedTransaction = await TransactionModel.findOneAndUpdate(
		{_id: req.params.id },
		{
		  subTotalReal: subTotal,
		  subTotal: subTotalDisplay,
		  taxReal: totalTax,
		  tax: totalTaxDisplay,
		  totalReal: total,
		  total: totalDisplay,
		},
		{ new: true }
	)

	console.log(updatedTransaction)

	res.json(updatedTransaction)
}	

module.exports.createNewTransaction = async function(req, res, next) {
	try{ 
		const { createdBy, createdAt } = req.body

		const TransactionModel = mongoose.model('Transaction', TicketTransaction, 'Transactions_' + req.headers['x-mongo-key'])
		const newTransaction = new TransactionModel(req.body)

		const savedTransaction = await newTransaction.save()
			
			console.log("Sending event information to events handler")

			events.postNewEvent(req, res, next, {
				actionType: 'New Transaction',
				createdBy,
				createdAt,
				creatorId: req.body.client._id,
				description: `has opened a new Ticket.`
			})
		
			return res.json(savedTransaction)

	} catch(err) { next(err) }
}

module.exports.updatePushTransactionById = async function(req, res, next) {
	try {

		const TransactionModel = mongoose.model('Transaction', TicketTransaction, 'Transactions_' + req.headers['x-mongo-key'])
		const updatedTransactionWithNewSubdoc = await TransactionModel.findOneAndUpdate(
			{_id: req.params.id},
			{ $push: { items: req.body } },
			{ new: true }
		);
			if (!updatedTransactionWithNewSubdoc) return res.status(404).send("No transaction item with that ID.")
		
			req.body.menuItemSubdocs = updatedTransactionWithNewSubdoc.items;		
				
				next();

	} catch(err) { next(err) }
}

module.exports.pullItemFromArray = async function(req, res, next) {
	try {
		
		const TransactionModel = mongoose.model('Transaction', TicketTransaction, 'Transactions_' + req.headers['x-mongo-key'])
		const updatedTransaction = await TransactionModel.findOneAndUpdate(
			{_id: req.params.id},
			{ $pull: { items: { _id: req.body.subdoc_Id } } },
			{ new: true }
		); 
		
			if (!updatedTransaction) return res.status(404).send("No transaction item with that ID.")
		
		
			req.body.menuItemSubdocs = updatedTransaction.items;
		
				next()

	} catch(err) { next(err) }
}

module.exports.pushCustomerAddon = async function(req, res, next) {
	try{

		const TransactionModel = mongoose.model('Transaction', TicketTransaction, 'Transactions_' + req.headers['x-mongo-key'])
		const MenuItemModel = mongoose.model('MenuItem', MenuSchema,'MenuItems_' + req.headers['x-mongo-key'])
		const addOn = new MenuItemModel(req.body)
		
		const updatedTransaction = await TransactionModel.findOneAndUpdate(
			{_id: req.params.id},
			{ $push: { items:addOn } },
			{ new: true }
		);
			if (!updatedTransaction) return res.status(404).send("No transaction item with that ID.")
		
				req.body.menuItemSubdocs = updatedTransaction.items
					
					next()

	} catch(err) { next(err) }
}
module.exports.getTransactionById = async function (req, res, next) {
	try{ 

		const TransactionModel = mongoose.model('Transaction', TicketTransaction, 'Transactions_' + req.headers['x-mongo-key'])
		const transaction = await TransactionModel.findOne({_id: req.params.id})

			if (!transaction) return res.status(404).send("No transaction item with that ID.")

				return res.json(transaction)

	} catch(err) { next(err) }
}

module.exports.getAllTransactions = async function (req, res, next) {
	try{ 

		const TransactionModel = mongoose.model('Transaction', TicketTransaction, 'Transactions_' + req.headers['x-mongo-key'])
		const transactions = await TransactionModel.find({})

			if (!transactions) return res.status(404).send("No transactions in this directory")

				return res.json(transactions)

	} catch(err) { next(err) }
}

module.exports.updateTransactionById = async function (req, res, next) {
	try{ 

		const TransactionModel = mongoose.model('Transaction', TicketTransaction, 'Transactions_' + req.headers['x-mongo-key'])
		const transaction = await TransactionModel.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})

			if (!transaction) return res.status(404).send("No transaction item with that ID")

				return res.json(transaction)

	} catch(err) { next(err) }
}

module.exports.deleteTransactionById = async function (req, res, next) {
	try{ 

		const TransactionModel = mongoose.model('Transaction', TicketTransaction, 'Transactions_' + req.headers['x-mongo-key'])
		const transaction = await TransactionModel.findOneAndRemove({_id: req.params.id})

			if (!transaction) return res.status(404).send("No transaction item with that ID")

				return res.status(200).send("Deleted Transaction Item")

	} catch(err) { next(err) }
}

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