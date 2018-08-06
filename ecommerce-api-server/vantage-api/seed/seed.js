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



module.exports.seedOmniUsers = async (req, res, next) => {
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

module.exports.seedEssosMarket = async (req, res, next) => {
	try {
		const essosSeeds = [
			{
				email: 'aturner@sneakerheadz.com',

				firstName: 'Aaron',
				lastName: 'Turner',
				phone: '(411)-789-4131',

				accountType: 'Essos',
				avatarURL: './assets/seed/essos-avatars/aturner.jpg',
				// dont forget the hash u cucklord


				billing_address_line1: '919 Cedar Grove Rd',
				billing_address_city: 'Wynnewood',
				billing_address_zip: '19096',
				billing_address_state: 'PA',
				shipping_address_line1: '919 Cedar Grove Rd',
				shipping__address_city: 'Wynnewood',
				shipping_address_zip: '19096',
				shipping_address_state: 'PA',
		


				marketplaceItems: [
					{},
					{},
				],
			},
		]
	} catch(err) { next(err) }
}
const essosSeeds = [
	{
		email: 'aturner@sneakerheadz.com',

		firstName: 'Aaron',
		lastName: 'Turner',
		phone: '(411)-789-4131',

		accountType: 'Essos',
		avatarURL: './assets/seed/essos-avatars/aturner.jpg',
		// dont forget the hash u cucklord


		billing_address_line1: '919 Cedar Grove Rd',
		billing_address_city: 'Wynnewood',
		billing_address_zip: '19096',
		billing_address_state: 'PA',
		shipping_address_line1: '919 Cedar Grove Rd',
		shipping__address_city: 'Wynnewood',
		shipping_address_zip: '19096',
		shipping_address_state: 'PA',
		
		mongoCollectionKey: uuid4().slice(0, 13);

		marketplaceItems: [
			{
				itemName: 'Purple Jordans',
				itemPrice: 120,
				tags: [`Men's Shoes`],
				numberInStock: 1,
				imageURL: './assets/seed/marketplace/pjordan.jpg',
			},
			{
				itemName: 'Charcoal Adidas',
				itemPrice: 59,
				tags: [`Men's Shoes`],
				numberInStock: 4,
				imageURL: './assets/seed/marketplace/chadidas.jpg',
			},
			{
				itemName: 'Felt Slip-Ons',
				itemPrice: 39,
				numberInStock: 2,
				tags: [`Men's Shoes`, `Women's Shoes`],
				imageURL: './assets/seed/marketplace/fslip.jpg'
			},
			{
				itemName: 'Butterfly Boots',
				itemPrice: 60,
				numberInStock: 3, 
				tags: [`Women's Shoes`],
				imageURL: './assets/seed/marketplace/bboots.jpg',
			},
			{
				itemName: 'Black Yeezys',
				itemPrice: 435,
				numberInStock: 2,
				tags: [`Men's Shoes`, `Women's Shoes`],
				imageURL: './assets/seed/marketplace/bfeezy.jpg',
			},
			{
				itemName: 'Black Levis',
				itemPrice: 30,
				numberInStock: 10,
				tags: [`Men's Shoes`, `Women's Shoes`],
				imageURL: './assets/seed/marketplace/blevi.jpg'

			},
			{
				itemName: 'Pink Nike Airs',
				itemPrice: 50,
				numberInStock: 2,
				tags: [`Women's Shoes`],
				imageURL: './assets/seed/marketplace/pnike.jpg',
			},
			{
				itemName: 'Black Adidas',
				itemPrice: 100,
				numberInStock: 1,
				tags: [`Men's Shoes`],
				imageURL: './assets/seed/marketplace/badidas.jpg',
			},
			{
				itemName: 'Black Leather Hi-Tops',
				itemPrice: 100,
				numberInStock: 2, 
				tags: [`Men's Shoes`],
				imageURL: './assets/seed/marketplace/btop.jpg',
			},
			{
				itemName: 'Original Air Jordan 1',
				itemPrice: 570,
				numberInStock: 1,
				tags: [`Men's Shoes`],
				imageURL: './assets/seed/marketplace/j1.jpg',
			},
			{
				itemName: 'Tribal Canvas Vans',
				itemPrice: 88,
				numberInStock: 1,
				tags: [`Men's Shoes`, `Women's Shoes`],
				imageURL: './assets/seed/marketplace/tribals.jpg'
			},
			{
				itemName: 'Loafmaster Loafers',
				itemPrice: 90,
				numberInStock: 2,
				tags: [`Men's Shoes`],
				imageURL: './assets/seed/marketplace/loafman.jpg',
			},
		],
	},
	{
		email: 'pwatch@timepiece.com',

		firstName: 'Philippe',
		lastName: 'Arnaud',
		phone: '(551)-412-2312',

		accountType: 'Essos',
		avatarURL: './assets/seed/essos-avatars/fil.jpg',
		// dont forget the hash u cucklord


		billing_address_line1: '303 Washington St',
		billing_address_city: 'Hempstead',
		billing_address_zip: '11550',
		billing_address_state: 'NY',
		shipping_address_line1: '303 Washington St',
		shipping__address_city: 'Hempstead',
		shipping_address_zip: '11550',
		shipping_address_state: 'NY',
		
		hash:
		mongoCollectionKey: 

		marketplaceItems: [
			{
				itemName: 'Panerai Luminor Marina',
				itemPrice: 1650,
				numberInStock: 1,
				tags: [`Watches`],
				imageURL: './assets/seed/marketplace/lumi.jpg',
			},
			{
				itemName: 'Breitling Chronometre Certifie',
				itemPrice: itemPrice: 4162,
				numberInStock: 1,
				tags: [`Watches`],
				imageURL: './assets/seed/marketplace/bling.jpg',
			},
			{
				itemName: 'Wood-Grain Orient Mako',
				itemPrice: 300,
				numberInStock: 2,
				tags: [`Watches`],
				imageURL: './assets/seed/marketplace/mako.jpg',
			},
			{
				itemName: 'Sekonda Mens Classic',
				itemPrice: 450,
				numberInStock: 2,
				tags: [`Watches`],
				imageURL: './assets/seed/marketplace/sekonda.jpg',
			},
		],
	},
	{
		email: 'sb@thred.com',

		firstName: 'Sarah',
		lastName: 'Franko',
		phone: '(222)-314-4444',

		accountType: 'Essos',
		avatarURL: './assets/seed/essos-avatars/sara.jpg',
		// dont forget the hash u cucklord

		billing_address_line1: '553 Washington St',
		billing_address_city: 'Hempstead',
		billing_address_zip: '11550',
		billing_address_state: 'NY',
		shipping_address_line1: '553 Washington St',
		shipping__address_city: 'Hempstead',
		shipping_address_zip: '11550',
		shipping_address_state: 'NY',
		
		mongoCollectionKey: 

		marketplaceItems: [
			{
				itemName: 'Sweater-ish CropTop',
				itemPrice: 39,
				numberInStock: 1,
				tags: [`Women's Clothing`, `Tops`],
				imageURL: './assets/seed/marketplace/gcrop.jpg',
			},
			{
				itemName: 'Navy Peacoat',
				itemPrice: 140,
				numberInStock: 1,
				tags: [`Women's Clothing`, `Tops`],
				imageURL: './assets/seed/marketplace/bcoat.jpg',
			},
			{
				itemName: 'Shein Bodysuit',
				itemPrice: 40,
				numberInStock: 1,
				tags: [`Women's Clothing`, `Tops`, `Bottoms`],
				imageURL: './assets/seed/marketplace/shein.jpg',
			},
			{
				itemName: 'Pink J.Crew Coat',
				itemPrice: 70,
				numberInStock: 1,
				tags: [`Women's Clothing`, `Tops`],
				imageURL: './assets/seed/marketplace/pink.jpg',
			},

		],
	},
],

const essosUserSchema = new Schema({
	email: {type: String, required: true, unique: true },
	hash: { type: String, required: true },
	
	accountType: String,
	avatarURL: String,
	
	firstName: String,
	lastName: String,
	phone: String,
	
	billing_address_line1: String,
	billing_address_line2: String,
	billing_address_city: String,
	billing_address_zip: String,
	billing_address_state: String,
	shipping_address_line1: String,
	shipping_address_line2: String,
	shipping__address_city: String,
	shipping_address_zip: String,
	shipping_address_state: String,

	mongoCollectionKey: { type: String, index: true, required: true },

	token: String,
	tokenCreatedAt: Date,

	marketplaceRef_id: { type: Schema.Types.ObjectId, ref: 'Marketplace' }
	},
	{
		toObject:{ getters : true }	
	}
);

const clientSchema = new Schema({
	firstName: String,
	lastName: String,
	userName: String,
	phoneNumber: String,
	email: {type: String, required: true, unique: true },
	billing_address_line1: String,
	billing_address_line2: String,
	billing_address_city: String,
	billing_address_zip: String,
	billing_address_state: String,
	shipping_address_line1: String,
	shipping_address_line2: String,
	shipping__address_city: String,
	shipping_address_zip: String,
	shipping_address_state: String,
	isMaster: Boolean,
	employeeAuthorization: Boolean,
	organizationAuthorization: Boolean,
	employeeCounter: Number,
	masterLookupIdentifier: String, // This might just be Organization name to make it easier. Think about scale
	organizationName: String, // Used in the autocomplete to point Employees to the right way
	rosterJob: String,
	mongoCollectionKey: { type: String, required: true },
	isAdmin: { type: Boolean, index: true },
	hash: { type: String, required: true },
	token: String,
	tokenCreatedAt: Date,
	clockInNumber: String,
	accountType: String, 
	status: String, // PendingApproval[Pending] - Registered
	master_id: { type: Schema.Types.ObjectId, ref: 'Client' },
	marketplaceRef_id: { type: Schema.Types.ObjectId, ref: 'Marketplace' }
	},
	{
		toObject:{ getters : true }	
	}
);
module.exports.seedEssosMarket = async (req, res, next) => {

}
*/