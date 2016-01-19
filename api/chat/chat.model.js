'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var User = require('../user/user.model');

var ChatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  message: String,
  createdAt: Date
});

module.exports = mongoose.model('Chat', ChatSchema);