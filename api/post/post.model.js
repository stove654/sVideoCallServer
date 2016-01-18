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
      userId: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  ],
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      comment: String
    }
  ],
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: Date
});

module.exports = mongoose.model('Post', PostSchema);