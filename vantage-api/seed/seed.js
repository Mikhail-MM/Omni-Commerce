const uuid4 = require('uuid/v4');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios')

const terminalItems = require('./seed-omni-item-data');
// const omniChildren = require('./seed-omni-employees');

const config = require('../models/config');

const Users = require('../models/schemas/users');
const OmniUserModel = Users.OmniUser;
const EssosUserModel = Users.EssosUser;


const TerminalSchemas = require('../models/schemas/transaction')
const MenuItemSchema = TerminalSchemas.menuSchema


const storeConfig = require('../models/schemas/storeConfig')
const storeConfigSchema = storeConfig.storeConfigSchema

const MarketplaceModels = require('../models/schemas/marketplace')
const StoreItemSchema = MarketplaceModels.StoreItemSchema
const StoreItemModel = MarketplaceModels.StoreItemModel
const ShoppingCartModel = MarketplaceModels.ShoppingCartModel

const addUserPromise = async (user) => {
	try {
		const newUser = new EssosUserModel(user)
		const savedUser = await newUser.save()
		return savedUser
	} catch(err) { console.log(err) }
}
const generateRandomUsers = async (numUsers) => {
	try { 
			const response = await axios.get(`https://randomuser.me/api/?results=${numUsers}&nat=us,gb,fr`)
			const users = response.data.results
			const userProfileAdditionQueries = users.map(async (user, index) => {
				const avatarURL = (index < 20) ? user.picture.large : config.stockAvvys[Math.floor(Math.random() * 15)]
				const { email, phone } = user
				const hash = await bcrypt.hash(user.login.password, 2)
				return addUserPromise({
					email,
					firstName: user.name.first,
					lastName: user.name.last,
					phone,
					avatarURL,
					mongoCollectionKey: user.login.uuid,
					hash,
					accountType: 'Essos',
					billing_address_line1: user.location.street,
					billing_address_city: user.location.city,
					billing_address_zip: user.location.postcode,
					billing_address_state: user.location.state,
					shipping_address_line1: user.location.street,
					shipping_address_city: user.location.city,
					shipping_address_zip: user.location.postcode,
					shipping_address_state: user.location.state,

				})
			})
			const addedUsers = await Promise.all(userProfileAdditionQueries)
			return true
	} 

	catch(err) { console.log(err) }	
}


const generateFollowerPairs = async (watcher, liked) => {
	try {

	} catch (err) { console.log(err )}
}

const generateFollowers = async () => {
	try { 
		const users = await EssosUserModel.find({})
		console.log('all users', users)
		let i = 0
		for (followedUser of users) {
				console.log('Current User:', followedUser.firstName)
				console.log('i:', i, 'progress:', i % users.length * 100 / users.length, '%')
			randonum = Math.floor(Math.random() * (users.length - (i + 1))) + (i + 1)
			console.log('randonum', randonum)
			if (randonum === i + 1) console.log("Can't slice at own position, no followers for this one.")
				if (randonum !== i + 1) {
							const randoFollowers = users.slice(i + 1, randonum)
							const randoNames = randoFollowers.map(fol => fol.firstName)
							console.log('randofollowers:', randoNames)
							const committedFollowerPairs = randoFollowers
							.map(async (follower) => { 
								const makePairFollower = await EssosUserModel.findOneAndUpdate(
									{_id: follower._id},
									{ $push: { following: { 
										userId: followedUser._id,
										name: `${followedUser.firstName} ${followedUser.lastName}`,
										avatarURL: followedUser.avatarURL,
									}}},
									{upsert: true, new: true},
								)
								const makePairFollowed = await EssosUserModel.findOneAndUpdate(
									{_id: followedUser.id},
									{ $push: { followers: {
										userId: follower._id,
										name: `${follower.firstName} ${follower.lastName}`,
										avatarURL: follower.avatarURL,
									}}},
									{upsert: true, new: true},
								)
								return { follower: makePairFollower, followed: makePairFollowed }
								
							})
							const result = await Promise.all(committedFollowerPairs)
						}

			i++
		}
		return true

	} catch(err) { console.log(err) }
}


const determineReview = (mood) => `${mood}`
const generateRating = (mood) => {
	console.log(mood)
	switch(mood){
		case('bad'): return ({
			rating: (Math.floor(Math.random() * (3 - 0) + 0)),
			review: determineReview(mood),
		})
		case('average'): return ({
			rating: (Math.floor(Math.random() * (5 - 3) + 3)),
			review: determineReview(mood),
		})
		case('good'): return ({
			rating: (Math.floor(Math.random() * (6 - 4) + 4)),
			review: determineReview(mood),
		})
	}
}
const weighRatingType = () => {
	let distribution = Math.random()
	console.log("DISTRIBUTION...", distribution)
	switch(true) {
		case(distribution > 0.9): return 'bad'
		case(distribution > 0.5): return 'average'
		case(distribution > 0): return 'good'
	}
}
const generateReviews = async () => {
	const allItems = await StoreItemModel.find({})
	const allUsers = await EssosUserModel.find({})
	for (item of allItems) {
		let slice1 = Math.floor(Math.random() * (allUsers.length - 0) + 0)
		let slice2 = Math.floor(Math.random() * (allUsers.length - 0) + 0)
		while (slice1 === slice2) { slice1 = Math.floor(Math.random() * (allUsers.length - 0) + 0) }
		const hiSlice = (slice1 > slice2) ? slice1 : slice2
		const loSlice = (slice1 < slice2) ? slice1 : slice2
		console.log("lo, hi ", loSlice, hiSlice )
		const userSlice = allUsers.slice(loSlice, hiSlice)
		const numReviews = userSlice.length
		console.log(numReviews, 'num reviews')
		const loadedReviewers = userSlice.map(user => ({
				user: user,
				review: generateRating(weighRatingType())
			})
		)
		const addedItemReviews = loadedReviewers.map(async (queryData) => {
			const { rating, review } = queryData.review
			const reviewQuery = await StoreItemModel.findOneAndUpdate(
					{_id: item._id}, 
					{ $push: { reviews: {
						userId: queryData.user._id,
						name: `${queryData.user.firstName} ${queryData.user.lastName}`,
						avatarURL: queryData.user.avatarURL,
						rating,
						review,
					}}},
					{upsert: true, new: true},
				)
			return reviewQuery
		})

		const resolution = await Promise.all(addedItemReviews)
	}
	return true
}

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

				avatarURL: '/assets/seed/omni-avatars/2.jpg',

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

				avatarURL: '/assets/seed/omni-avatars/3.jpg',

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

				avatarURL: '/assets/seed/omni-avatars/4.jpg',

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

				avatarURL: '/assets/seed/omni-avatars/5.jpg',

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

				avatarURL: '/assets/seed/omni-avatars/6.jpg',

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

				avatarURL: '/assets/seed/omni-avatars/7.jpg',

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

				avatarURL: '/assets/seed/omni-avatars/8.jpg',

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

			avatarURL: '/assets/seed/omni-avatars/1.jpg',

			mongoCollectionKey: seedMongoKey,
			hash: hashedPass,

			terminalIDNumber: 1,

			employeeCounter: omniChildren.length + 2,
		}
		const terminalData = {
			email: `${seedMongoKey}@terminal.com`,
			hash: hashedPass,
			accountType: 'Terminal',
			isAdmin: false,
			isMaster: false,
			terminalIDNumber: 0,
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

		const savedChildren = [];
		const savedShoppingCarts = [];
		const savedItems = [];

		const hashedPass = await bcrypt.hash('12345', 10);
		const essosSeeds = [
			{
				email: 'aturner@sneakerheadz.com',
				hash: hashedPass,

				firstName: 'Aaron',
				lastName: 'Turner',
				phone: '(411)-789-4131',

				accountType: 'Essos',
				avatarURL: '/assets/seed/essos-avatars/aturner.jpg',
				// dont forget the hash u cucklord


				billing_address_line1: '919 Cedar Grove Rd',
				billing_address_city: 'Wynnewood',
				billing_address_zip: '19096',
				billing_address_state: 'PA',
				shipping_address_line1: '919 Cedar Grove Rd',
				shipping_address_city: 'Wynnewood',
				shipping_address_zip: '19096',
				shipping_address_state: 'PA',
				
				mongoCollectionKey: uuid4().slice(0, 13),

				marketplaceItems: [
					{
						itemName: 'Purple Jordans',
						itemPrice: 120,
						description: "Excellent condition Js. All come in like-new condition with original box packaging.",
						tags: [`Shoes - Men's`],
						numberInStock: 1,
						imageURL: '/assets/seed/marketplace/pjordan.jpg',
					},
					{
						itemName: 'Charcoal Adidas',
						itemPrice: 59,
						description: "Classic style, low-key color. Great posture support, solid running shoes.",
						tags: [`Shoes - Men's`],
						numberInStock: 4,
						imageURL: '/assets/seed/marketplace/chadidas.jpg',
					},
					{
						itemName: 'Felt Slip-Ons',
						itemPrice: 39,
						description: "Flexible, comfortable, and easy on the feet.",
						numberInStock: 2,
						tags: [`Shoes - Men's`, `Shoes - Women's`,],
						imageURL: '/assets/seed/marketplace/fslip.jpg'
					},
					{
						itemName: 'Butterfly Boots',
						itemPrice: 60,
						description: "Really good for the fall season.",
						numberInStock: 3, 
						tags: [`Shoes - Women's`],
						imageURL: '/assets/seed/marketplace/bboots.jpg',
					},
					{
						itemName: 'Black Yeezys',
						itemPrice: 435,
						description: "Can't go wrong with the Yeezys. These are the real thing.",
						numberInStock: 2,
						tags: [`Shoes - Men's`, `Shoes - Women's`],
						imageURL: '/assets/seed/marketplace/bfeezy.jpg',
					},
					{
						itemName: 'Black Levis',
						itemPrice: 30,
						description: "Your basic black pair of sneakers.",
						numberInStock: 10,
						tags: [`Shoes - Men's`, `Shoes - Women's`],
						imageURL: '/assets/seed/marketplace/blevi.jpg'

					},
					{
						itemName: 'Pink Nike Airs',
						itemPrice: 50,
						description: "Great running shoes",
						numberInStock: 2,
						tags: [`Shoes - Women's`],
						imageURL: '/assets/seed/marketplace/pnike.jpg',
					},
					{
						itemName: 'Black Adidas',
						itemPrice: 100,
						description: "Awesome shoes. Still in great condition.",
						numberInStock: 1,
						tags: [`Shoes - Men's`],
						imageURL: '/assets/seed/marketplace/badidas.jpg',
					},
					{
						itemName: 'Black Leather Hi-Tops',
						itemPrice: 100,
						description: "Awesome shoes. Perfect condition!!",
						numberInStock: 2, 
						tags: [`Shoes - Men's`],
						imageURL: '/assets/seed/marketplace/btop.jpg',
					},
					{
						itemName: 'Original Air Jordan 1',
						itemPrice: 570,
						numberInStock: 1,
						description: "Classic!! Only have a few of these left.",
						tags: [`Shoes - Men's`],
						imageURL: '/assets/seed/marketplace/j1.jpg',
					},
					{
						itemName: 'Tribal Canvas Vans',
						itemPrice: 88,
						description: "Vans are always comfy. We will have other cool designs in soon .. follow us!!",
						numberInStock: 1,
						tags: [`Shoes - Men's`, `Shoes - Women's`],
						imageURL: '/assets/seed/marketplace/tribals.jpg'
					},
					{
						itemName: 'Loafmaster Loafers',
						itemPrice: 90,
						description: "For dressy occasions.",
						numberInStock: 2,
						tags: [`Shoes - Men's`],
						imageURL: '/assets/seed/marketplace/loafman.jpg',
					},
				],
			},
			{
				email: 'pwatch@timepiece.com',
				hash: hashedPass,

				firstName: 'Philippe',
				lastName: 'Arnaud',
				phone: '(551)-412-2312',

				accountType: 'Essos',
				avatarURL: '/assets/seed/essos-avatars/fil.jpg',


				billing_address_line1: '303 Washington St',
				billing_address_city: 'Hempstead',
				billing_address_zip: '11550',
				billing_address_state: 'NY',
				shipping_address_line1: '303 Washington St',
				shipping_address_city: 'Hempstead',
				shipping_address_zip: '11550',
				shipping_address_state: 'NY',
				
				mongoCollectionKey: uuid4().slice(0, 13),

				marketplaceItems: [
					{
						itemName: 'Panerai Luminor Marina',
						itemPrice: 1650,
						numberInStock: 1,
						description: "Sleek. Luxurious. Elegant.",
						tags: [`Accessories`, `Watches`],
						imageURL: '/assets/seed/marketplace/lumi.jpg',
					},
					{
						itemName: 'Breitling Chronometre Certifie',
						itemPrice: 4162,
						description: "Opulent. Extravegant. Obscene. Flaunt your lifestyle with a certified Breitling.",
						numberInStock: 1,
						tags: [`Accessories`, `Watches`],
						imageURL: '/assets/seed/marketplace/bling.jpg',
					},
					{
						itemName: 'Wood-Grain Orient Mako',
						itemPrice: 300,
						description: "A more modern look.",
						numberInStock: 2,
						tags: [`Accessories`, `Watches`],
						imageURL: '/assets/seed/marketplace/mako.jpg',
					},
					{
						itemName: 'Sekonda Mens Classic',
						itemPrice: 450,
						description: "Embrace your masculinity. Wear Sekonda.",
						numberInStock: 2,
						tags: [`Accessories`, `Watches`],
						imageURL: '/assets/seed/marketplace/sekonda.jpg',
					},
				],
			},
			{
				email: 'sb@thred.com',
				hash: hashedPass,

				firstName: 'Sarah',
				lastName: 'Franko',
				phone: '(222)-314-4444',

				accountType: 'Essos',
				avatarURL: '/assets/seed/essos-avatars/sara.jpg',

				billing_address_line1: '553 Washington St',
				billing_address_city: 'Hempstead',
				billing_address_zip: '11550',
				billing_address_state: 'NY',
				shipping_address_line1: '553 Washington St',
				shipping_address_city: 'Hempstead',
				shipping_address_zip: '11550',
				shipping_address_state: 'NY',
				
				mongoCollectionKey: uuid4().slice(0, 13),

				marketplaceItems: [
					{
						itemName: 'Sweater-ish CropTop',
						itemPrice: 39,
						description: "A nice top for fall.",
						numberInStock: 1,
						tags: [`Clothing - Women's`],
						imageURL: '/assets/seed/marketplace/gcrop.jpg',
					},
					{
						itemName: 'Navy Peacoat',
						itemPrice: 140,
						description: "A great jacket for late fall and early winter.",
						numberInStock: 1,
						tags: [`Clothing - Women's`],
						imageURL: '/assets/seed/marketplace/bcoat.jpg',
					},
					{
						itemName: 'Shein Bodysuit',
						itemPrice: 40,
						description: "Cool one-piece for the beach.",
						numberInStock: 1,
						tags: [`Clothing - Women's`],
						imageURL: '/assets/seed/marketplace/shein.jpg',
					},
					{
						itemName: 'Pink J.Crew Coat',
						itemPrice: 70,
						description: "Back to school vibes.",
						numberInStock: 1,
						tags: [`Clothing - Women's`],
						imageURL: '/assets/seed/marketplace/pink.jpg',
					},

				],
			},
			{
				email: 'md@beautiful.com',
				hash: hashedPass,

				firstName: 'Monica',
				lastName: 'Bailey',
				phone: '(213)-231-4131',

				accountType: 'Essos',
				avatarURL: '/assets/seed/essos-avatars/sara.jpg',

				billing_address_line1: '600 Washington St',
				billing_address_city: 'Hempstead',
				billing_address_zip: '11550',
				billing_address_state: 'NY',
				shipping_address_line1: '600 Washington St',
				shipping_address_city: 'Hempstead',
				shipping_address_zip: '11550',
				shipping_address_state: 'NY',
				
				mongoCollectionKey: uuid4().slice(0, 13),

				marketplaceItems:[
					{
						itemName:'Marie Veronique Skincare Set',
						itemPrice: 150,
						numberInStock: 1, 
						description: "Full set including everything you need.",
						tags: [`Beauty`],
						imageURL: '/assets/seed/marketplace/mv.jpg',
					},
					{
						itemName: 'Miss Dior Fragrance',
						itemPrice: 50,
						numberInStock: 30,
						description: 'Hints of Lavender and Vanilla.',
						tags: [`Beauty`, 'Fragrance & Perfume'],
						imageURL: '/assets/seed/marketplace/mdior.jpg',
					},
					{
						itemName: 'Makeup Brush Set',
						itemPrice: 29,
						description: "Basic starter set for applying blush and concealer",
						numberInStock: 1,
						tags: [`Beauty`, 'Make-Up'],
						imageURL: '/assets/seed/marketplace/brushset.jpg',
					},
					{
						itemName: 'Chanel No. 5',
						itemPrice: 69,
						description: "A good fragrance for guys and girls.",
						numberInStock: 20,
						tags: [`Beauty`, 'Fragrance & Perfume'],
						imageURL: '/assets/seed/marketplace/chanel.jpg',
					},
					{
						itemName: 'Glossier Blush Kit',
						itemPrice: 40,
						numberInStock: 1,
						description: "Comes with many shades for different contours.", 
						tags: [`Beauty`, 'Make-Up'],
						imageURL: '/assets/seed/marketplace/glossier.jpg',
					},
					{
						itemName: 'Prestige Mens Pomade',
						itemPrice: 29,
						description: "Medium hold, water and sweat resistatnt.",
						numberInStock: 2,
						tags: [`Beauty`, 'Grooming'],
						imageURL: '/assets/seed/marketplace/pomade.jpg',		
					},
					{
						itemName: 'Nude By Nature Concealer',
						itemPrice: 15,
						description: "Good for removing acne blemishes during breakouts and for help with dark spots.",
						numberInStock: 1,
						tags: [`Beauty`, 'Make-Up'],
						imageURL: '/assets/seed/marketplace/concealer.jpg',
					},
				],	
			},
		]

		for (essosUser of essosSeeds) {
			// Create new User Entry in DB
			const { 
				email, 
				hash, 
				accountType, 
				firstName, 
				lastName, 
				phone, 
				avatarURL,
				billing_address_line1,
				billing_address_line2,
				billing_address_city,
				billing_address_zip,
				billing_address_state,
				shipping_address_line1,
				shipping_address_line2,
				shipping_address_city,
				shipping_address_zip,
				shipping_address_state,
				mongoCollectionKey,
			} = essosUser

			const userData = {
				email, 
				hash, 
				accountType, 
				firstName, 
				lastName, 
				phone, 
				avatarURL,
				billing_address_line1,
				billing_address_line2,
				billing_address_city,
				billing_address_zip,
				billing_address_state,
				shipping_address_line1,
				shipping_address_line2,
				shipping_address_city,
				shipping_address_zip,
				shipping_address_state,
				mongoCollectionKey,
			}

			const newEssosUser = new EssosUserModel(userData)
			const savedEssosUser = await newEssosUser.save()

			savedChildren.push(savedEssosUser)
			// Build shopping cart for User

			const newShoppingCart = new ShoppingCartModel({ 
							
				ownerRef_id			: savedEssosUser._id,
				subtotalDisplay		: 0,
				subtotalReal		: 0,
				taxDisplay			: 0,
				taxReal				: 0,
				totalDisplay		: 0,
				totalReal			: 0,
			
			});

			
			const savedShoppingCart = await newShoppingCart.save();

			savedShoppingCarts.push(savedShoppingCart);

			for (item of essosUser.marketplaceItems) {
				const {
					itemName,
					itemPrice,
					numberInStock,
					tags,
					imageURL,
					description,
				} = item

				const itemData = {
					itemName,
					itemPrice,
					numberInStock,
					tags,
					imageURL,
					description,
					sellerRef_id: savedEssosUser._id,
					postedBy: `${essosUser.firstName} ${essosUser.lastName}`
				}

				const newMarketplaceItem = new StoreItemModel(itemData)
				const savedMarketplaceItem = await newMarketplaceItem.save()

				savedItems.push(savedMarketplaceItem)
			}
		}

		await generateRandomUsers(100);
		await generateFollowers();
		await generateReviews();

		const response = {
			savedChildren,
			savedShoppingCarts,
			savedItems
		}

		res.send(response)
		
	} catch(err) { next(err) }
}


module.exports.seedFeaturedItems = async (req, res, next) => {
	try {
		
		const savedChildren = [];
		const savedShoppingCarts = [];
		const savedItems = [];

		const hashedPass = await bcrypt.hash('12345', 10);

		const featuredSeed = [{
						email: 'ijones@essos.com',
						hash: hashedPass,
		
						firstName: 'Isis',
						lastName: 'Jones',
						phone: '(423)-789-4131',
		
						accountType: 'Essos',
						avatarURL: '/assets/seed/essos-avatars/isis.jpg',
						billing_address_line1: '919 Cedar Grove Rd',
						billing_address_city: 'Wynnewood',
						billing_address_zip: '19096',
						billing_address_state: 'PA',
						shipping_address_line1: '919 Cedar Grove Rd',
						shipping_address_city: 'Wynnewood',
						shipping_address_zip: '19096',
						shipping_address_state: 'PA',
		
						mongoCollectionKey: uuid4().slice(0, 13),
		
						marketplaceItems: [
							{
								itemName: 'Yellow Blouse',
								itemPrice: 75,
								description: "Play it casual or dressy with this bright yellow top.",
								tags: [`Clothing - Women's`],
								numberInStock: 10,
								imageURL: '/assets/store-splash/featured-1.jpg',
							},
							{
								itemName: 'Floral Blazer',
								itemPrice: 125,
								description: "Flower-Emblazoned Blazer to bring on the fun at your next party. Surprisingly fancy.",
								tags: [`Clothing - Men's`],
								numberInStock: 10,
								imageURL: '/assets/store-splash/featured-2-2.jpg',
							},
							{
								itemName: 'Blue Flowy Sundress',
								itemPrice: 98,
								description: "A sweet look for the Spring season.",
								tags: [`Clothing - Women's`],
								numberInStock: 10,
								imageURL: '/assets/store-splash/featured-3.jpg',
							},
							{
								itemName: 'Movado Ultra Slim',
								itemPrice: 695,
								description: "What time is it? Time for you to buy this watch! Minimalist & Modern.",
								tags: [`Clothing - Women's`],
								numberInStock: 10,
								imageURL: '/assets/store-splash/featured-4.jpg',
							},
						],
					}]
			
			const jumbotronSeed = [{
							email: 'bks@essos.com',
							hash: hashedPass,
			
							firstName: 'Brooklyn',
							lastName: 'Supply Co.',
							phone: '(423)-789-4131',
			
							accountType: 'Essos',
							avatarURL: '/assets/seed/essos-avatars/bk.jpg',
			
							billing_address_line1: '919 Cedar Grove Rd',
							billing_address_city: 'Wynnewood',
							billing_address_zip: '19096',
							billing_address_state: 'PA',
							shipping_address_line1: '919 Cedar Grove Rd',
							shipping_address_city: 'Wynnewood',
							shipping_address_zip: '19096',
							shipping_address_state: 'PA',
			
							mongoCollectionKey: uuid4().slice(0, 13),
			
							marketplaceItems: [
								{
									itemName: 'BKSCO Trucker Hat',
									itemPrice: 35,
									description: "Adjustable fit for all sizes.",
									tags: [`Clothing - Men's`],
									numberInStock: 10,
									imageURL: '/assets/store-splash/jumbotron-cart-1.jpg',
								},
								{
									itemName: 'Paradise Graphic Tee',
									itemPrice: 40,
									description: "Psychadellic vibes.",
									tags: [`Clothing - Men's`],
									numberInStock: 10,
									imageURL: '/assets/store-splash/jumbotron-cart-3.jpg',
								},
								{
									itemName: 'Herschel Supply Co. Backpack',
									itemPrice: 80,
									description: "Stylish and sturdy backpack for Back to School",
									tags: [`Accessories`],
									numberInStock: 10,
									imageURL: '/assets/store-splash/jumbotron-cart-2.jpeg',
								},
								{
									itemName: 'Gray Canvas Mid-Calf Socks',
									itemPrice: 20,
									description: "100% Cotton",
									tags: [`Clothing - Men's`],
									numberInStock: 10,
									imageURL: '/assets/store-splash/jumbotron-cart-4.jpg',
								},
								{
									itemName: 'True Religion Rocco Skinny Jeans',
									itemPrice: 90,
									description:"That distressed look",
									tags: [`Clothing - Men's`],
									numberInStock: 10,
									imageURL: '/assets/store-splash/jumbotron-cart-5.jpg',
								},
								{
									itemName: 'Nike Air Max 2',
									itemPrice: 90,
									description: "Just Do It.",
									tags: [`Shoes - Men's`],
									numberInStock: 10,
									imageURL: '/assets/store-splash/jumbotron-cart-6.jpg',
								},
							],
						}]

			for (essosUser of featuredSeed) {
			// Create new User Entry in DB
			const { 
				email, 
				hash, 
				accountType, 
				firstName, 
				lastName, 
				phone, 
				avatarURL,
				billing_address_line1,
				billing_address_line2,
				billing_address_city,
				billing_address_zip,
				billing_address_state,
				shipping_address_line1,
				shipping_address_line2,
				shipping_address_city,
				shipping_address_zip,
				shipping_address_state,
				mongoCollectionKey,
			} = essosUser

			const userData = {
				email, 
				hash, 
				accountType, 
				firstName, 
				lastName, 
				phone, 
				avatarURL,
				billing_address_line1,
				billing_address_line2,
				billing_address_city,
				billing_address_zip,
				billing_address_state,
				shipping_address_line1,
				shipping_address_line2,
				shipping_address_city,
				shipping_address_zip,
				shipping_address_state,
				mongoCollectionKey,
			}

			const newEssosUser = new EssosUserModel(userData)
			const savedEssosUser = await newEssosUser.save()

			savedChildren.push(savedEssosUser)

			const newShoppingCart = new ShoppingCartModel({ 
							
				ownerRef_id			: savedEssosUser._id,
				subtotalDisplay		: 0,
				subtotalReal		: 0,
				taxDisplay			: 0,
				taxReal				: 0,
				totalDisplay		: 0,
				totalReal			: 0,
			
			});

			
			const savedShoppingCart = await newShoppingCart.save();

			savedShoppingCarts.push(savedShoppingCart);

			for (item of essosUser.marketplaceItems) {


				const {
					itemName,
					itemPrice,
					numberInStock,
					tags,
					imageURL,
					description,
				} = item

				const itemData = {
					itemName,
					itemPrice,
					numberInStock,
					tags,
					imageURL,
					description,
					sellerRef_id: savedEssosUser._id,
					postedBy: `${essosUser.firstName} ${essosUser.lastName}`,
					queryMarker: 'Featured-1'
				}
				const newMarketplaceItem = new StoreItemModel(itemData)
				const savedMarketplaceItem = await newMarketplaceItem.save()

				savedItems.push(savedMarketplaceItem)
			}
		}

		for (essosUser of jumbotronSeed) {
			// Create new User Entry in DB
			const { 
				email, 
				hash, 
				accountType, 
				firstName, 
				lastName, 
				phone, 
				avatarURL,
				billing_address_line1,
				billing_address_line2,
				billing_address_city,
				billing_address_zip,
				billing_address_state,
				shipping_address_line1,
				shipping_address_line2,
				shipping_address_city,
				shipping_address_zip,
				shipping_address_state,
				mongoCollectionKey,
			} = essosUser

			const userData = {
				email, 
				hash, 
				accountType, 
				firstName, 
				lastName, 
				phone, 
				avatarURL,
				billing_address_line1,
				billing_address_line2,
				billing_address_city,
				billing_address_zip,
				billing_address_state,
				shipping_address_line1,
				shipping_address_line2,
				shipping_address_city,
				shipping_address_zip,
				shipping_address_state,
				mongoCollectionKey,
			}

			const newEssosUser = new EssosUserModel(userData)
			const savedEssosUser = await newEssosUser.save()

			savedChildren.push(savedEssosUser)

			const newShoppingCart = new ShoppingCartModel({ 
							
				ownerRef_id			: savedEssosUser._id,
				subtotalDisplay		: 0,
				subtotalReal		: 0,
				taxDisplay			: 0,
				taxReal				: 0,
				totalDisplay		: 0,
				totalReal			: 0,
			
			});

			
			const savedShoppingCart = await newShoppingCart.save();

			savedShoppingCarts.push(savedShoppingCart);

			for (item of essosUser.marketplaceItems) {


				const {
					itemName,
					itemPrice,
					numberInStock,
					tags,
					imageURL
				} = item

				const itemData = {
					itemName,
					itemPrice,
					numberInStock,
					tags,
					imageURL,
					sellerRef_id: savedEssosUser._id,
					postedBy: `${essosUser.firstName} ${essosUser.lastName}`,
					queryMarker: 'Jumbotron-1',
				}
				const newMarketplaceItem = new StoreItemModel(itemData)
				const savedMarketplaceItem = await newMarketplaceItem.save()

				savedItems.push(savedMarketplaceItem)
			}
		}

		const response = {
			savedChildren,
			savedShoppingCarts,
			savedItems
		}

		res.send(response)

	} catch(err) { next(err) }
}
