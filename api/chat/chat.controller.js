/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /Chats              ->  index
 * POST    /Chats              ->  create
 * GET     /Chats/:id          ->  show
 * PUT     /Chats/:id          ->  update
 * DELETE  /Chats/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Chat = require('./chat.model');

// Get list of Chats
exports.index = function(req, res) {
  Chat.find()
    .populate('user')
    .exec(function (err, Chats) {
      if(err) { return handleError(res, err); }
      return res.json(200, Chats);
    });
};

// Get a single Chat
exports.show = function(req, res) {
  Chat.findById(req.params.id, function (err, Chat) {
    if(err) { return handleError(res, err); }
    if(!Chat) { return res.send(404); }
    return res.json(Chat);
  });
};

// Creates a new Chat in the DB.
exports.create = function(req, res) {
  req.body.createdAt = new Date();
  Chat.create(req.body, function(err, Chat) {
    if(err) { return handleError(res, err); }
    return res.json(201, Chat);
  });
};

// Updates an existing Chat in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Chat.findById(req.params.id, function (err, Chat) {
    if (err) { return handleError(res, err); }
    if(!Chat) { return res.send(404); }
    var updated = _.merge(Chat, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, Chat);
    });
  });
};

// Deletes a Chat from the DB.
exports.destroy = function(req, res) {
  Chat.findById(req.params.id, function (err, Chat) {
    if(err) { return handleError(res, err); }
    if(!Chat) { return res.send(404); }
    Chat.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}