module.exports.aggregateSalesData = async function(req, res, next) {
	const Transaction = mongoose.model('Transaction', TicketTransaction, req.headers['x-mongo-key'] + '_Transactions')
	try {
		const AllTicketsBySession = await Transaction.Find({})
		res.json(AllTicketsBySession)
	} catch(err) { next(err) }
} 