'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/config.js');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var Notification = require('../notification/notification.model')


var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

exports.showPublic = function(req, res) {
  User.find(function (err, users) {
    var data = [];
    for (var i = 0; i < users.length; i++) {
      data.push({
        email: users[i].email,
        name: users[i].name,
        _id: users[i]._id,
        avatar: users[i].avatar,
        status: users[i].status
      })
    }
    if(err) return res.send(500, err);
    res.json(200, data);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secret, { expiresInMinutes: 60*5 });
    res.json({
      success: true,
      message: 'Enjoy your token!',
      token: token
    });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;
  User.findById(userId)
    .populate('follows.user')
    .exec(function (err, user) {
      if(err) { return handleError(res, err); }
      return res.json(200, user);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  console.log(req.body);
  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, User) {
    if (err) { return handleError(res, err); }
    if(!User) { return res.send(404); }
    var updated = _.merge(User, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, User);
    });
  });
};

// Updates an existing User in the DB.
exports.follow = function (req, res) {
  var dataFollow = {
    user: req.body.user
  };

  console.log(dataFollow);
  User.findById(req.params.id, function (err, data) {
    if (err) {
      return handleError(res, err);
    }
    if (!data) {
      return res.send(404);
    }
    var isFollow = false;
    for (var i = 0; i < data.follows.length; i++) {
      if (dataFollow.user == data.follows[i].user) {
        isFollow = true;
        data.follows.splice(i, 1)
        break;
      }
    }
    var notification = {
      userFrom: dataFollow.user,
      userTo: req.params.id,
      createdAt: new Date()
    };

    if (!isFollow) {
      data.follows.push(dataFollow);
      notification.action = 3;
    } else {
      notification.action = 4;
    }
    Notification.create(notification);
    data.save(function (err, Post) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, Post);
    });
  });
};


/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
