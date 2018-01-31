const mongoose = require('mongoose');
const Schemas = require('../models/schemas/marketplace')
const Marketplace = Schemas.marketplaceSchema
const MarketplaceModel = mongoose.model('Marketplace', Marketplace)

module.exports.createNewMarketplace = async function(req, res, next) { 
	try {
		const newMarketplace = new MarketplaceModel(req.body)
		const savedModel = await newMarketplace.save()
			res.json(savedModel)
	} catch(err) { next(err) }
}

module.exports.getAllMarketplaces = async function(req, res, next) {
	try {
		const foundMarketPlaces = await MarketplaceModel.find({});
			res.json(foundMarketPlaces)
	} catch(err) { next(err) }
}
module.exports.getMarketplaceById = async function(req, res, next) { 
	try {
		const marketplace = await MarketplaceModel.findOne({_id: req.params.id}) 
			res.json(marketplace)
	} catch(err) { next(err) }
}

module.exports.updateMarketplaceById = async function(req, res, next) { 
	try {
		const updatedMarketPlace = await MarketplaceModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new:true })
			res.json(updatedMarketPlace)
	} catch(err) { next(err) }
}
