/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /Notifications              ->  index
 * POST    /Notifications              ->  create
 * GET     /Notifications/:id          ->  show
 * PUT     /Notifications/:id          ->  update
 * DELETE  /Notifications/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Notification = require('./notification.model');

// Get list of Notifications
exports.index = function(req, res) {
  Notification.find()
    .populate('userFrom')
    .populate('userTo')
    .sort({'createdAt': 'desc'})
    .exec(function (err, Notifications) {
      if(err) { return handleError(res, err); }
      return res.json(200, Notifications);
    });
};

// Get a single Notification
exports.show = function(req, res) {
  Notification.findById(req.params.id, function (err, Notification) {
    if(err) { return handleError(res, err); }
    if(!Notification) { return res.send(404); }
    return res.json(Notification);
  });
};

// Creates a new Notification in the DB.
exports.create = function(req, res) {
  Notification.create(req.body, function(err, Notification) {
    if(err) { return handleError(res, err); }
    return res.json(201, Notification);
  });
};

// Updates an existing Notification in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Notification.findById(req.params.id, function (err, Notification) {
    if (err) { return handleError(res, err); }
    if(!Notification) { return res.send(404); }
    var updated = _.merge(Notification, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, Notification);
    });
  });
};

// Deletes a Notification from the DB.
exports.destroy = function(req, res) {
  Notification.findById(req.params.id, function (err, Notification) {
    if(err) { return handleError(res, err); }
    if(!Notification) { return res.send(404); }
    Notification.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}