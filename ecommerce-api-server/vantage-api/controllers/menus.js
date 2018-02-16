const mongoose = require('mongoose');
const Schemas = require('../models/schemas/transaction')
const menuSchema = Schemas.menuSchema

module.exports.createNewMenuItem = function(req, res, next) {
	const MenuItem = mongoose.model('MenuItem', menuSchema, req.headers['x-mongo-key'] + '_MenuItems');
	const newMenu = new MenuItem(req.body);
	
	newMenu.save(function(err, menu) {
		if (err) return next(err);
		return res.json(menu);
	});
}

module.exports.getMenuItemByIdNoReturnId = function (req, res, next) {
	const MenuItem = mongoose.model('MenuItem', menuSchema, req.headers['x-mongo-key'] + '_MenuItems')
	MenuItem.findOne({_id: req.params.id}, '-_id', function(err, menuItem) {
		if(err) return next(err);
		if(!menuItem) res.status(404).send("Could not find Menu item with that ID");
		console.log("Returning Menu Item WITHOUT ID:")
		console.log(menuItem)
		return res.json(menuItem);
	})
}



module.exports.getAllMenuItems = function (req, res, next) {
	const MenuItem = mongoose.model('MenuItem', menuSchema, req.headers['x-mongo-key'] + '_MenuItems')
	MenuItem.find({}, function(err, menuItems) {
		if (err) return next(err);
		if (!menuItems) res.status(404).send("Could not locate any Menu Items in database");
		return res.json(menuItems);
	})
}

module.exports.getMenuItemById = function(req, res, next) {
	const MenuItem = mongoose.model('MenuItem', menuSchema, req.headers['x-mongo-key'] + '_MenuItems')
	MenuItem.findOne({_id: req.params.id}, function(err, menuItem) {
		if(err) return next(err);
		if(!menuItem) res.status(404).send("Could not find Menu item with that ID");
		return res.json(menuItem);
	})
}

module.exports.updateMenuItemById = function (req, res, next) {
	const MenuItem = mongoose.model('MenuItem', menuSchema, req.headers['x-mongo-key'] + '_MenuItems')
	MenuItem.findOneAndUpdate({_id: req.params.id}, req.body, 
		{ new: true }, function(err, menuItem) {
		if (err) return next(err);
		if (!menuItem) res.status(404).send("No menu item with that ID!")
		res.json(menuItem);
	})
}
module.exports.deleteMenuItemById = function (req, res, next) {
	const MenuItem = mongoose.model('MenuItem', menuSchema, req.headers['x-mongo-key'] + '_MenuItems')
	MenuItem.findOneAndRemove({_id: req.params.id}, function(err, menuItem) {
		if (err) return next(err);
		if (!menuItem) res.status(404).send("No menu item with that ID!");
		res.status(200).send("Deleted menu item");
	})
}

