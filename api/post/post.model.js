'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
  status: String,
});

module.exports = mongoose.model('Post', PostSchema);