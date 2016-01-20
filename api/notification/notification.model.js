'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var User = require('../user/user.model');

/*
* actions
* 1: like,
* 2: unlike
* 3: follow
* 4: unfollow
* 5: comment
* 6: status
* */

var NotificationSchema = new Schema({
  userFrom: { type: Schema.Types.ObjectId, ref: 'User' },
  userTo: { type: Schema.Types.ObjectId, ref: 'User' },
  action: Number,
  createdAt: Date
});

module.exports = mongoose.model('Notification', NotificationSchema);