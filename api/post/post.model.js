'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var User = require('../user/user.model');

var PostSchema = new Schema({
  status: String,
  albums: [
    {
      url: String
    }
  ],
  likes: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  ],
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      comment: String,
      createdAt: Date
    }
  ],
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: Date
});

module.exports = mongoose.model('Post', PostSchema);