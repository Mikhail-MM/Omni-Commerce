const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
  sentBy: { type: Schema.Types.ObjectId, ref: 'Client' },
  heading: { type: String, required: true },
  textContent: { type: String, required: true },
  isAnnouncement: Boolean,
  sentTo: { type: Schema.Types.ObjectId, ref: 'Client' },
  sentDate: { type: Date, required: true, default: Date.now },
  mongoCollectionKey: String,
  messageReadStatus: Boolean,
  globalBroadcast: Boolean,
});

module.exports.Message = mongoose.model('Message', messageSchema);
