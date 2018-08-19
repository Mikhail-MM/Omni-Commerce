const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
	actionType: String,
	createdBy: String,
	creatorId: { type: Schema.Types.ObjectId, ref: 'OmniUser' },
	createdAt: Date,
	description: String,
	metadata: { type: Schema.Types.Mixed }
})

module.exports.EventSchema = EventSchema