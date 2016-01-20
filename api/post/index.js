'use strict';

var express = require('express');
var controller = require('./post.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/public/:id', controller.postById);
router.get('/albums/:id', controller.albumById);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/comment/:id', controller.comment);
router.put('/like/:id', controller.like);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
