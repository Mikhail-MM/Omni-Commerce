const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  img: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model('Image', ItemSchema);
