/* eslint-disable eol-last */
/* eslint-disable comma-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  logged_in: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
