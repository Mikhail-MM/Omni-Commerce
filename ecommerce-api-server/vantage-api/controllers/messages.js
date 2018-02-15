const Message = require('../models/schemas/message')

module.exports.composeNewMessage = async function(req, res, next) {
	
	try{
		const data = {
			sentBy: req.body.client._id,
			heading: req.body.title,
			textContent: req.body.message,
			sentTo: req.body.sentTo,
			sentDate: Date.now,
			isAnnouncement: false,
		}

		const newMessage = new Message(data)
		const savedNewMessage = await newMessage.save()
		res.json(savedNewMessage)
	} catch(err) { next(err) }

}

module.exports.composeNewAnnouncement = async function(req, res, next) {
	
	try {
		const data = {
			sentBy: req.body.client._id,
			heading: req.body.title,
			textContent: req.body.message,
			sentTo: req.body.sentTo,
			sentDate: Date.now,
			mongoCollectionKey: req.body.client.mongoCollectionKey,
			isAnnouncement: true,
		}

		const newAnnouncement = new Message(data);
		const savedAnnouncement = await newAnnouncement.save();
		res.json(savedAnnouncement);

	} catch(err) { next(err) }
}

module.exports.globallyBroadcastAnnouncement = async function(req, res, next) {

	try {
		const globalAnnouncement = await Message.findOneAndUpdate({_id: req.body._id} {globalBroadcast: true}, {new: true})
	} catch(err) { next(err) }
}

module.exports.muteGlobalAnnouncement = async function(req, res, next) {

	try {
		const globalAnnouncement = await Message.findOneAndUpdate({_id: req.body._id} {globalBroadcast: false}, {new: true})
	} catch(err) { next(err) }
}

module.exports.getAllMyMessages = async function(req, res, next) {

	try {
		const myMessages = await Message.find({ sentTo: req.body.client._id, isAnnouncement: false })
		if (!myMessages) res.status(404).send("Could not find any Messages")
		res.json(myMessages)
	} catch(err) { next(err) }
}

module.exports.getAllAnnouncementsByOrganization = async function(req, res, next) {

	try {
		const myAnnouncements = await message.find( { isAnnouncement: true, mongoCollectionKey: req.body.client.mongoCollectionKey })
		if(!myAnnouncements) res.status(404).send("Could not find any announcements")
		res.json(myAnnouncements)
	} catch(err) { next(err) }
}

module.exports.deleteMessage = async function(req, res, next) {

	try{
		const deletedMessage = await Message.findOneAndRemove({ _id: req.body._id })
		if (!deletedMessage) res.status(404).send("Could not find Message")
		res.json(deletedMessage)

	} catch(err) { next(err) }
}

