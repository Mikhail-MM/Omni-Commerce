const mongoose = require('mongoose');
const EventSchema =  require('../models/schemas/event').EventSchema

const io = require('../socket/initialize').io()

module.exports.getEventFeed = async (req, res, next) => {
	try {
		
		const EventModel = mongoose.model('Event', EventSchema, `${req.headers['x-mongo-key']}_Events`)
		const feed = await EventModel.find({})
			res.json(feed)

	} catch(err) { next(err) }
}

module.exports.postNewEvent = async (req, res, next, eventData) => {
	try{
		console.log("NEW EVENT BEING POSTED!")
		
		const EventModel = mongoose.model('Event', EventSchema, `${req.headers['x-mongo-key']}_Events`)
		const newEvent = new EventModel(eventData)
		const savedEvent = await newEvent.save()
			console.log("Created new event: ", savedEvent)
			io.emit('getevent', savedEvent)

	} catch(err) { next(err) }
}