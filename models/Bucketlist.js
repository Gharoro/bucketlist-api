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
  }
});

const BucketlistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  items: [ItemSchema],
  date_created: {
    type: Date,
    default: Date.now
  },
  date_modified: {
    type: Date,
    default: Date.now
  },
  created_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
});

const Bucketlist = mongoose.model('Bucketlist', BucketlistSchema);
module.exports = Bucketlist;