const mongoose = require('mongoose');
const Schemas = require('../models/schemas/transaction')
const menuSchema = Schemas.menuSchema

module.exports.createNewMenuItem = async function(req, res, next) {
	try{ 
		
		const MenuItemModel = mongoose.model('MenuItem', menuSchema,'MenuItems_' + req.headers['x-mongo-key'])
		const newMenu = new MenuItemModel(req.body);
		
		const savedMenuItem = await newMenu.save()

			res.json(savedMenuItem)
	
	} catch(err) { next(err) }
}


module.exports.getMenuItemByIdNoReturnId = async function (req, res, next) {
	try { 
		
		const MenuItemModel = mongoose.model('MenuItem', menuSchema,'MenuItems_' + req.headers['x-mongo-key'])
		const menuItem = await MenuItemModel.findOne({_id: req.params.id}, '-_id')

		if (!menuItem) return res.status(404).send("Could not find item with that ID")

			return res.json(menuItem)

	} catch(err) { next(err) }

}


module.exports.getAllMenuItems = async function (req, res, next) {
	try { 
		
		const MenuItemModel = mongoose.model('MenuItem', menuSchema,'MenuItems_' + req.headers['x-mongo-key'])
		const menuItems = await MenuItemModel.find({})

		if (!menuItems) return res.status(404).send("Could not find items in this directory")

			return res.json(menuItems)

	} catch(err) { next(err) }
}


module.exports.getMenuItemById = async function(req, res, next) {
	try { 
		
		const MenuItemModel = mongoose.model('MenuItem', menuSchema,'MenuItems_' + req.headers['x-mongo-key'])
		const menuItem = await MenuItemModel.findOne({_id: req.params.id})

		if (!menuItem) return res.status(404).send("Could not find item with that ID") 

			return res.json(menuItem)

	} catch(err) { next(err) }
}


module.exports.updateMenuItemById = async function (req, res, next) {
	try { 
		
		const MenuItemModel = mongoose.model('MenuItem', menuSchema,'MenuItems_' + req.headers['x-mongo-key'])
		const menuItem = await MenuItemModel.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})

		if (!menuItem) return res.status(404).send("Could not find item with that ID")

			return res.json(menuItem)

	} catch(err) { next(err) }
}


module.exports.deleteMenuItemById = async function (req, res, next) {
	try{ 
		
		const MenuItemModel = mongoose.model('MenuItem', menuSchema,'MenuItems_' + req.headers['x-mongo-key'])
		const menuItem = await MenuItemModel.findOneAndRemove({_id: req.params.id})

		if (!menuItem) return res.status(404).send("No menu item with that ID!")

			return res.json(menuItem)

	} catch(err) { next(err) }
}

