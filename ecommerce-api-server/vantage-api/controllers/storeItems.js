const mongoose = require('mongoose');
const Schemas = require('../models/schemas/marketplace')
const MarketplaceModels = require('../models/schemas/marketplace')
const Users = require('../models/schemas/users');

const EssosUser = Users.EssosUser;
const StoreItemModel = MarketplaceModels.StoreItemModel


module.exports.createNewStoreItem = async function(req, res, next) { 
		try {
			const data = Object.assign({}, req.body, {
				sellerRef_id: req.body.client._id,
				marketplaceRef_id: req.body.client.marketplaceRef_id
			});
				const newStoreItem = new StoreItemModel(data)
				const savedModel = await newStoreItem.save()
				res.json(savedModel)
		} catch(err) { next(err) }
}
module.exports.getAllStoreItems = async function(req, res, next) {
		try {
			const foundStoreItems = await StoreItemModel.find({});
				res.json(foundStoreItems)
		} catch(err) { next(err) }
}
module.exports.getStoreItemById = async function(req, res, next) {
		try {
			const storeItem = await StoreItemModel.findOne({_id: req.params.id}) 
				res.json(storeItem)
		} catch(err) { next(err) }
}
module.exports.updateStoreItemById = async function(req, res, next) { 
		try {
			const updatedStoreItem = await StoreItemModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new:true })
				res.json(updatedStoreItem)
		} catch(err) { next(err) }
}
module.exports.findAllItemsFromMarketplace = async function(req, res, next) {
	try {
		console.log(req.params.id)
		const marketplaceSpecificStoreItems = await StoreItemModel.find({marketplaceRef_id: req.params.id})
			res.json(marketplaceSpecificStoreItems)
		
	} catch(err) { next(err) }
}

module.exports.retrieveStoreItemWithoutId = async function(req, res, next) {
	try { 
		const noIdItem = await StoreItemModel.findOne({_id: req.params.id}, '-_id')
			res.json(noIdItem)
		} catch(err) { next(err) }
}

module.exports.handleWishlistRequest = async (req, res, next) => {
	try {
		const { mode } = req.body

		const authorizedUser = await EssosUser.findById(req.headers['x-user-id'])
		const favoriteItem = await StoreItemModel.findById(req.params.id)

		if (mode === 'add') {
			console.log("Adding item")
			const updateUser = await EssosUser.findOneAndUpdate(
				{_id: req.headers['x-user-id']}, 
				{ $push: { wishlist: {
					itemId: req.params.id,
					imageURL: favoriteItem.imageURL
				}}},
				{upsert: true, new: true},
			)
			const updateItemFollowers = await StoreItemModel.findOneAndUpdate(
				{_id: req.params.id},
				{ $push: { followers: {
					userId: req.headers['x-user-id'],
					avatarURL: authorizedUser.avatarURL,
				}}},
				{upsert: true, new: true},
			)
			res.json(updateUser.wishlist)
		} else if (mode === 'remove') {
			console.log("Removing item")
			const updateUser = await EssosUser.findOneAndUpdate(
				{_id: req.headers['x-user-id']},
				{ $pull: { wishlist: { itemId: req.params.id }}},
				{upsert: true, new: true},
			)

			const updateItemFollowers = await StoreItemModel.findOneAndUpdate(
				{_id: req.params.id},
				{ $pull : { followers: { userId: req.headers['x-user-id'] }}},
				{upsert: true, new: true},
			)
			res.json(updateUser.wishlist)
		}
	} catch(err) { next(err) }
}

module.exports.retrieveUserWishlist = async (req, res, next) => {
	try {
		const authorizedUser = await EssosUser.findById(req.headers['x-user-id'])
		const { wishlist } = authorizedUser

		res.json(wishlist)
		
	} catch(err) { next(err) }
}

module.exports.appendRatingToItem = async (req, res, next) => {
	try{
		console.log('Add dat wishlist')
	} catch(err) { next(err) }
}