require('dotenv').config()
const stripe = require('stripe')(process.env.SECRET_KEY);
const BigNumber = require('bignumber.js');


module.exports.createCashCharge = function(req, res, next) {
  console.log("Creating Cash Charge")
  // Needs error handling to ensure that customer didn't over/underpay due to cached redux values that didn't update for whatever reason
  req.params._id = req.body.parentTransaction._id;
  const totalBalance = new BigNumber(req.body.parentTransaction.totalReal).round(2)
  const customerPaid = new BigNumber(req.body.payment.cashTenderedByCustomer).round(2)

  req.body.payment.refund = customerPaid.minus(totalBalance).toNumber()
  res.json(req.body)
}

module.exports.createStripeCharge = function(req, res, next) {
	const token = req.body.stripeToken.id // stripe token id
  const stripeAmount = new BigNumber(req.body.chargeTotal).times(100).round().toNumber()
  console.log(stripeAmount)
	stripe.charges.create({
		amount: stripeAmount,
		currency: "usd",
		description: "A sample charge",
		source: token
	}, function(err, charge) {
		if (err) return next(err)
		res.json(charge)
	});
}

module.exports.validateMarketplacePayment = function (req, res, next) {
  // Go through all objects
  // Query DB to see whether item has enough stock to satisfy cart request
  // If so, findOneAndUpdate the item to reflect new stock
  // Do final validation to see whether updated item is >0
}
/* Example of what a Stripe Token Object sent as req.body looks like:

{ id: 'tok_1BnGDOJGFIfkFzodqxlod2tr',
  object: 'token',
  card:
   { id: 'card_1BnGDOJGFIfkFzodvU1pEfoW',
     object: 'card',
     address_city: null,
     address_country: null,
     address_line1: null,
     address_line1_check: null,
     address_line2: null,
     address_state: null,
     address_zip: '23123',
     address_zip_check: 'unchecked',
     brand: 'Visa',
     country: 'US',
     cvc_check: 'unchecked',
     dynamic_last4: null,
     exp_month: 2,
     exp_year: 2031,
     funding: 'credit',
     last4: '4242',
     metadata: {},
     name: 'Random Customer',
     tokenization_method: null },
  client_ip: '69.142.127.151',
  created: 1516669482,
  livemode: false,
  type: 'card',
  used: false }

  */

  /* Here is a sample charge object which is returned to the Client from Stripe's in-house API

Object { id: "ch_1BnGGIJGFIfkFzodJRDrKOb1", object: "charge", amount: 1000, amount_refunded: 0, application: null, application_fee: null, balance_transaction: "txn_1BnGGIJGFIfkFzodwhuOiAVW", captured: true, created: 1516669662, currency: "usd", … } payments.js:15
amount: 1000
amount_refunded: 0
application: null
application_fee: null
balance_transaction: "txn_1BnGGIJGFIfkFzodwhuOiAVW"
captured: true
created: 1516669662
currency: "usd"
customer: null
description: "A sample charge"
destination: null
dispute: null
failure_code: null
failure_message: null
fraud_details: Object {  }
id: "ch_1BnGGIJGFIfkFzodJRDrKOb1"
invoice: null
livemode: false
metadata: Object {  }
object: "charge"
on_behalf_of: null
order: null
outcome: Object { network_status: "approved_by_network", risk_level: "normal", seller_message: "Payment complete.", … }
paid: true
receipt_email: null
receipt_number: null
refunded: false
refunds: {…}
data: Array []
has_more: false
object: "list"
total_count: 0
url: "/v1/charges/ch_1BnGGIJGFIfkFzodJRDrKOb1/refunds"
__proto__: Object { … }
review: null
shipping: null
source: {…}
address_city: null
address_country: null
address_line1: null
address_line1_check: null
address_line2: null
address_state: null
address_zip: "23123"
address_zip_check: "pass"
brand: "Visa"
country: "US"
customer: null
cvc_check: "pass"
dynamic_last4: null
exp_month: 2
exp_year: 2031
fingerprint: "kWMhu8ftOrZpobg2"
funding: "credit"
id: "card_1BnGGFJGFIfkFzod81WSjizJ"
last4: "4242"
metadata: {}
__proto__: Object { … }
name: "Random Customer"
object: "card"
tokenization_method: null
__proto__: Object { … }
source_transfer: null
statement_descriptor: null
status: "succeeded"
transfer_group: null
__proto__: Object { … }

*/