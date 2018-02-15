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
		const savedAnnouncement = newAnnouncement.save();
		res.json(savedAnnouncement);

	} catch(err) { next(err) }
}

module.exports.globallyBroadcastAnnouncement = async function(req, res, next) {

	try {
		const globalAnnouncement = Message.findOneAndUpdate({_id: req.body._id} {globalBroadcast: true}, {new: true})
	} catch(err) { next(err) }
}

module.exports.muteGlobalAnnouncement = async function(req, res, next) {

	try {
		const globalAnnouncement = Message.findOneAndUpdate({_id: req.body._id} {globalBroadcast: false}, {new: true})
	} catch(err) { next(err) }
}

