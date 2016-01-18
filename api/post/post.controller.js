/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /Posts              ->  index
 * POST    /Posts              ->  create
 * GET     /Posts/:id          ->  show
 * PUT     /Posts/:id          ->  update
 * DELETE  /Posts/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Post = require('./post.model');

// Get list of Posts
exports.index = function (req, res) {
  Post.find()
    .populate('userId')
    .sort({'createdAt': 'desc'})
    .exec(function (err, Posts) {
      if(err) { return handleError(res, err); }
      return res.json(200, Posts);
    });
};

// Get a single Post
exports.show = function (req, res) {
  Post.findById(req.params.id, function (err, Post) {
    if (err) {
      return handleError(res, err);
    }
    if (!Post) {
      return res.send(404);
    }
    return res.json(Post);
  });
};

// Creates a new Post in the DB.
exports.create = function (req, res) {
  req.body.createdAt = new Date();
  Post.create(req.body, function (err, Post) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, Post);
  });
};

// Updates an existing Post in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Post.findById(req.params.id, function (err, Post) {
    if (err) {
      return handleError(res, err);
    }
    if (!Post) {
      return res.send(404);
    }
    var updated = _.merge(Post, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, Post);
    });
  });
};

// Deletes a Post from the DB.
exports.destroy = function (req, res) {
  Post.findById(req.params.id, function (err, Post) {
    if (err) {
      return handleError(res, err);
    }
    if (!Post) {
      return res.send(404);
    }
    Post.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}