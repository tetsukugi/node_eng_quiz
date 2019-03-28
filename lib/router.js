'use strict';
const postsHandler = require('./posts-handler');
const util = require('./handler-util');

function route(req, res) {
    switch (req.url) {
        case '/quiz':
            postsHandler.handle(req, res);
            break;
        case '/logout':
            util.handleLogout(req, res);
            break;
        case '/':
            util.handleHome(req, res);
            break;
        case '/home':
            util.handleHome(req, res);
            break;
        case '/score':
            util.handleScore(req, res);
            break;
        default:
            util.handleNotFound(req, res);
            break;
    }
}

module.exports = {
    route: route
};