/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var postUser = require('./post.model');

exports.register = function(socket) {
  postUser.schema.post('save', function (doc) {
    postUser.findById(doc.id)
      .populate('user')
      .populate('comments.user')
      .populate('likes.user')
      .exec(function (err, data) {
        console.log(data);
        onSave(socket, data);
      });
  });
  postUser.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('postUser:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('postUser:remove', doc);
}

