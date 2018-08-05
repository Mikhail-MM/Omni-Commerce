const uuid4 = require('uuid/v4');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const terminalItems = require('./seed-omni-item-data');
// const omniChildren = require('./seed-omni-employees');

const Users = require('../models/schemas/users');
const OmniUserModel = Users.OmniUser;
const EssosUserModel = Users.EssosUser;


const TerminalSchemas = require('../models/schemas/transaction')
const MenuItemSchema = TerminalSchemas.menuSchema


const storeConfig = require('../models/schemas/storeConfig')
const storeConfigSchema = storeConfig.storeConfigSchema



module.exports.seedOmniUsers = async (req, res, next,) => {
	try {
		const savedChildren = [];
		const savedItems = [];

		const seedMongoKey = uuid4().slice(0, 13);
		const hashedPass = await bcrypt.hash('12345', 10);
const omniChildren = [
	{
		email: 'swasserman@omni.com',

		firstName: 'Sarah',
		lastName: 'Wasserman',
		phone: '(423)-231-5123',

		accountType: 'Child',
		role: 'Hostess',
		isMaster: false,
		isAdmin: false,

		avatarURL: './assets/seed/omni-avatars/2.jpg',

		mongoCollectionKey: seedMongoKey,
		hash: hashedPass,

		terminalIDNumber: 2,
	},
	{
		email: 'jpalmer@omni.com',

		firstName: 'Jared',
		lastName: 'Palmer',
		phone: '(561)-231-4142',

		accountType: 'Child',
		role: 'Bartender',
		isMaster: false,
		isAdmin: false,

		avatarURL: './assets/seed/omni-avatars/3.jpg',

		mongoCollectionKey: seedMongoKey,
		hash: hashedPass,

		terminalIDNumber: 3,
	},
	{
		email: 'gwaller@omni.com',

		firstName: 'Gina',
		lastName: 'Waller',
		phone: '(423)-231-5123',

		accountType: 'Child',
		role: 'Waitstaff',
		isMaster: false,
		isAdmin: false,

		avatarURL: './assets/seed/omni-avatars/4.jpg',

		mongoCollectionKey: seedMongoKey,
		hash: hashedPass,

		terminalIDNumber: 4,
	},
	{
		email: 'fguzman@omni.com',

		firstName: 'Francisco',
		lastName: 'Guzman',
		phone: '(522)-223-1156',

		accountType: 'Child',
		role: 'Sous Chef',
		isMaster: false,
		isAdmin: false,

		avatarURL: './assets/seed/omni-avatars/5.jpg',

		mongoCollectionKey: seedMongoKey,
		hash: hashedPass,

		terminalIDNumber: 5,
	},
	{
		email: 'tfred@omni.com',

		firstName: 'Theo',
		lastName: 'Friedrich',
		phone: '(987)-513-2222',

		accountType: 'Child',
		role: 'Cook',
		isMaster: false,
		isAdmin: false,

		avatarURL: './assets/seed/omni-avatars/6.jpg',

		mongoCollectionKey: seedMongoKey,
		hash: hashedPass,

		terminalIDNumber: 6,
	},
	{
		email: 'jfranco@omni.com',

		firstName: 'James',
		lastName: 'Franco',
		phone: '(423)-231-5123',

		accountType: 'Child',
		role: 'Waitstaff',
		isMaster: false,
		isAdmin: false,

		avatarURL: './assets/seed/omni-avatars/7.jpg',

		mongoCollectionKey: seedMongoKey,
		hash: hashedPass,

		terminalIDNumber: 7,
	},
	{
		email: 'ekim@omni.com',

		firstName: 'Elena',
		lastName: 'Kim',
		phone: '(888)-212-4444',

		accountType: 'Child',
		role: 'Bartender',
		isMaster: false,
		isAdmin: false,

		avatarURL: './assets/seed/omni-avatars/8.jpg',

		mongoCollectionKey: seedMongoKey,
		hash: hashedPass,

		terminalIDNumber: 8,
	},
]

		
		const omniBossData = {
			email: 'bossman@omni.com',

			firstName: 'Sam',
			lastName: 'Thompson',
			phone: '(416)-931-4104',

			accountType: 'Master',
			role: 'Administrator',
			isMaster: true,
			isAdmin: true,

			avatarURL: './assets/seed/omni-avatars/1.jpg',

			mongoCollectionKey: seedMongoKey,
			hash: hashedPass,

			terminalIDNumber: 1,

			employeeCounter: omniChildren.length + 1,
		}
		const terminalData = {
			email: `${seedMongoKey}@terminal.com`,
			hash: hashedPass,
			accountType: 'Terminal',
			isAdmin: false,
			isMaster: false,
			teminalIDNumber: 0,
			mongoCollectionKey: seedMongoKey,
		};
		
		const newOmniMaster = new OmniUserModel(omniBossData);
		const newOmniTerminal = new OmniUserModel(terminalData);

		const savedOmniMaster = await newOmniMaster.save();
		const savedOmniTerminal = await newOmniTerminal.save();

		const StoreConfig = mongoose.model('StoreConfig', storeConfigSchema, seedMongoKey + '_StoreConfig');
		
		const newStoreConfig = new StoreConfig({

			mongoKey: seedMongoKey,
			loggedInUsers: ["Terminal"]

		});

		const savedStoreConfig = await newStoreConfig.save();

		// Iterate through employees & seed

		for (let itemData of terminalItems) {
			const ItemModel =  mongoose.model('MenuItem', MenuItemSchema, 'MenuItems_' + seedMongoKey);
			
			const newItemModel = new ItemModel(itemData);
			const savedItem = await newItemModel.save();

			savedItems.push(savedItem);
		}

		for (let employeeData of omniChildren) {
			const newOmniChild = new OmniUserModel(employeeData);

			const savedOmniChild = await newOmniChild.save();

			savedChildren.push(savedOmniChild)
		}

		const response = {
			savedOmniMaster,
			savedOmniTerminal,
			savedStoreConfig,
			savedItems,
			savedChildren,
		}

		res.send(response);

	} catch(err) { next(err) }
}

