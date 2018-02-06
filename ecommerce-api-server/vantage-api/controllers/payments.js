require('dotenv').config()
const stripe = require('stripe')(process.env.SECRET_KEY);
const BigNumber = require('bignumber.js');
const MarketPlaceModels = require('../models/schemas/marketplace')
StripeCustomerModel = MarketPlaceModels.StripeCustomerModel;
PurchaseOrderModel = MarketPlaceModels.PurchaseOrderModel;


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
  const response = {};
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

module.exports.saveStripeCustomerInformation = async function(req, res, next) {
const token = req.body.stripeToken.id
// Need to get shopping cart info and acquire Cart total!
console.log("Tabulating amount to be paid ")
const stripeAmount = new BigNumber(req.body.validatedPurchaseOrderToProcess.validatedCart.totalReal).times(100).round().toNumber()
stripe.customers.create({
  email: req.body.client.email,
  source: token,
}).then(async (customer) => {
  console.log("Creating Stripe Customer...")
  console.log(customer) // TODO: Save Customer and make routes. While we can use the natural customer here, if exporting this feature to POS system we must use Model with custom Mongo Key prefix in collection
  const data = Object.assign({}, customer, {clientRef_id: req.body.client._id})
  const newCustomerDataModel = new StripeCustomerModel(data)
  // we will need to manage this - add to DB only if customer not already existing? 
  console.log("Saving customer...")
  const savedCustomerEntity = await newCustomerDataModel.save()
  console.log(savedCustomerEntity);
  stripe.charges.create({
    amount: stripeAmount,
    currency: "usd",
    customer: customer.id
  }).then(async (charge) => {
    console.log("Stripe Charge Created...")
    console.log(charge)
    // const { itemsBought } = req.body.validatedPurchaseOrderToProcess.validatedCart
    const data = Object.assign({}, {itemsBought: req.body.validatedPurchaseOrderToProcess.validatedCart.itemsBought}, {
      customerRef_id: savedCustomerEntity._id,
      charge: charge
    });
    console.log("Building new purchase order")
    const newPurchaseOrder = new PurchaseOrderModel(data)
    const savedPurchaseOrder = await newPurchaseOrder.save()
    console.log(savedPurchaseOrder);
    req.body.validatedPurchaseOrderToProcess.savedPurchaseOrder = savedPurchaseOrder
  })
})
res.json(req.body.validatedPurchaseOrderToProcess);
}
module.exports.validateMarketplacePayment = function (req, res, next) {
    // Before running this, save a Stripe customer to charge later (we may need to save this into a DB, saving his shopping cart ref (Basically just a foreign key))
    // We will need to have a DECREMENT step - Create an array to store the History of Queries so that we can go and increment all items that fail validation.
    // The final test is this:
    // If the 3 step validation works - If the DECREMENTED ITEM LISTING IN THE DB has a STOCK of >=0, that shopping cart entry can be fulfilled and added to a purchase order
    // If not, We must return the decrement
    // If you want to still charge for as many items as possible, we will actually need recursion to reconcile the fulfillable amount, -
    // Reverse the first decrement
    // Query for the item's new, actual stock (since someone bought some to make this previously valid order invalid)
    // Change the amount requested within the shopping cart
    // Initialize validation again - and repeat if fails (and if stock is > 0)

    // To make this easier/less ugly, we may want to make a retryValidation function. 
    // Also, we can create an object const currentTarget {} instead of using longhand Array of Objects a certain index with certain key - just currentTarget.itemsBought - but doesnt matter rly

    // All Items that pass 3 step validation can be turned into a general purchase order for the buyer/server as a receipt
    // All items that fail are sent back to the thunk handler
    // A flag in the constructed response will determine whether to send invalidated item message

    // From here, splitting the Purchase Order will be simple enough. We will need a ref to the parent purchase order in each child, and each child is a seller-specific order that is sent
    // to the marketplace ref (essentially the client ref) as an ID
  
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