const mongoose = require('mongoose')
const Schema = mongoose.Schema

var messageSchema = new Schema({
	sentBy: { type: Schema.Types.ObjectId, ref: 'Client' },
	heading: { type: String, required: true },
	textContent: { type: String, required: true },
	isAnnouncement: Boolean,
	sentTo: { type: Schema.Types.ObjectId, ref: 'Client' },
	sentDate: { type: Date, required: true, default: Date.now },
	isAnnouncement: { type: Boolean, required: true }
	mongoKey: String,
	messageReadStatus: Boolean
	globalBroadcast: Boolean
});

var Message = mongoose.model('Message', messageSchema);

module.exports Message = Message;