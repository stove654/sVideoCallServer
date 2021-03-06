/**
 * Main application routes
 */

'use strict';

module.exports = function(app) {
    app.use('/auth', require('./auth'));
    app.use('/api/users', require('./api/user'));
    app.use('/api/posts', require('./api/post'));
    app.use('/api/chats', require('./api/chat'));
    app.use('/api/notifications', require('./api/notification'));
    //app.use('/api/things', require('./api/thing'));

    app.route('/:url(api|auth)/*')
        .get(function (req, res) {
            res.json({
                message: 'Hello dog!!!'
            })
        });

    app.route('/*')
        .get(function( req, res) {
            res.json({
                message: 'Hello dog!!!'
            })
        });
};
