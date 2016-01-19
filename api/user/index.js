'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.post('/', controller.create);
router.get('/public', controller.showPublic);
router.get('/:id', controller.show);
router.put('/:id', controller.update);

module.exports = router;
