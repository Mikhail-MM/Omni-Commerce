require('dotenv').config()
const _ = require('underscore');
const stripe = require('stripe')(process.env.SECRET_KEY);
const BigNumber = require('bignumber.js');

const MarketPlaceModels = require('../models/schemas/marketplace')
StripeCustomerModel = MarketPlaceModels.StripeCustomerModel;
PurchaseOrderModel = MarketPlaceModels.PurchaseOrderModel;
sellerSpecificPurchaseOrderModel = MarketPlaceModels.sellerSpecificPurchaseOrderModel;


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

// TODO: Comprehensive Error Handling using Stripe API Error Test
module.exports.saveStripeCustomerInformation = async function(req, res, next) {
  try { 
    
    const token = req.body.stripeToken.id
    const stripeAmount = new BigNumber(req.body.validatedPurchaseOrderToProcess.validatedCart.totalReal).times(100).round().toNumber()

      console.log("Check for existing customers with matching Client._id")

    const existingCustomer = StripeCustomerModel.findOne({clientRef_id: req.body.client._id})

      const createNewCustomer = async () => {
              
              console.log("Previous customer not found. Creating new customer")

              stripe.customers.create({
                email: req.body.client.email,
                shipping: {
                  address: {
                    line1: req.body.client.shipping_address_line1,
                    line2: req.body.client.shipping_address_line2,
                    city: req.body.client.shipping_address_city,
                    postal_code: req.body.client.shipping_zip,
                    state: req.body.client.shipping_address_state,
                  },
                  name: req.body.client.firstName.concat(' ', req.body.client.lastName),
                  phone: req.body.client.phoneNumber,
                },
              })
              .then( async(customer) => {

                console.log("New Stripe Customer Created:", customer)
                
                const customerData = Object.assign({}, customer, {clientRef_id: req.body.client._id});
                const newCustomerModel = new StripeCustomerModel(customerData);
                const savedCustomerEntity = await newCustomerDataModel.save();

                    return savedCustomerEntity;
              })
          
      }


    const customer = (existingCustomer) ? existingCustomer : await createNewCustomer()

    console.log('Using this customer:', customer)

      stripe.charges.create({
        amount: stripeAmount,
        currency: "usd",
        customer: customer.id,
        source: token,
        shipping: customer.shipping,
        statement_descriptor: "Omni Online Market",
      }).then( async (charge) => {

        console.log("Stripe Charge Created:", charge)
        
        const purchaseOrderData = Object.assign({}, {itemsBought: req.body.validatedPurchaseOrderToProcess.validatedCart.itemsBought}, {
          customerRef_id: customer._id,
          charge: charge
         });

        const newPurchaseOrder = new PurchaseOrderModel(purchaseOrderData);
        const savedPurchaseOrder = await newPurchaseOrder.save();

        console.log("Built new purchase order for buyer:", savedPurchaseOrder)

        req.body.validatedPurchaseOrderToProcess.savedPurchaseOrder = savedPurchaseOrder;

        const groupedShippingOrders = _.groupBy(savedPurchaseOrder.itemsBought, "sellerRef_id");
        const arrayOfShippingOrders = [];

        for (const seller_id in sellerSpecificShippingOrders) {

          // EXPORT THIS INTO NEW FUNCTION TO CALCULATE PRICING

          const bigNumberPrices = sellerSpecificShippingOrders[seller_id].map(item => {
            return { 
              itemPrice: new BigNumber(item.itemPrice),
              multipleRequest: new BigNumber(item.numberRequested),
            }
          });

          const subTotalBigNumber =  bigNumberPrices.reduce( (acc, cur) => { 
          return acc.plus((cur.itemPrice.times(cur.multipleRequest))) }, new BigNumber(0)
          )
             
              const taxRate = new BigNumber(0.07) 
              const subtotalReal = subTotalBigNumber.toNumber()
              const subtotalDisplay = subTotalBigNumber.round(2).toNumber()
              const taxReal = subTotalBigNumber.times(taxRate).toNumber()
              const taxDisplay = subTotalBigNumber.times(taxRate).round(2).toNumber()
              const totalReal = subTotalBigNumber.plus(taxReal).toNumber()
              const totalDisplay = subTotalBigNumber.plus(taxReal).round(2).toNumber()
            
                  const receiptObject = Object.assign({
                    sellerRef_id: seller_id,
                    masterOrderRef_id: savedPurchaseOrder._id,
                    itemsBought: sellerSpecificShippingOrders.seller_id,
                    subtotalReal: subtotalReal,
                    subtotalDisplay: subtotalDisplay,
                    taxReal: taxReal,
                    taxDisplay: taxDisplay,
                    totalReal: totalReal,
                    totalDisplay: totalDisplay,
                  })

                    arrayOfShippingOrders.push(receiptObject)
        }

                 req.body.validatedPurchaseOrderToProcess.arrayOfShippingOrders = arrayOfShippingOrders;
                  
                  for (const receipt of arrayOfReceiptsForBuyers) {
                    
                    const newSellerSpecificPurchaseOrder = new sellerSpecificPurchaseOrderModel(receipt);
                    const savedSellerSpecificPurchaseOrder = await newSellerSpecificPurchaseOrder.save()
                    console.log(savedSellerSpecificPurchaseOrder);
                  
                  }

                  res.json(req.body.validatedPurchaseOrderToProcess);

      })


  } catch(err) { next(err) }
  
}

module.exports.buildSubscription = async function(req, res, next) {
  
  const plan = stripe.plans.create({
    product: { name: "Vantage Point-of-Sale Business Class"},
    currency: 'usd',
    interval: 'month',
    nickname: 'Basic Monthly',
    amount: 100
  });

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