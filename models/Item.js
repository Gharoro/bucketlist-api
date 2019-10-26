/* eslint-disable eol-last */
/* eslint-disable comma-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create Schema for items
const ItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  date_modified: {
    type: Date,
    default: Date.now
  },
  done: {
    type: Boolean,
    default: false
  },
  bucket_list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bucketlists'
  },
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;