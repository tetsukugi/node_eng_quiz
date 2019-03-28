'use strict';
const pug = require('pug');
const Log = require('./log');

function handleLogout(req, res) {
    res.writeHead(401, {
        'Content-Type': 'text/plain; charset=utf-8'
    });
    res.end('logout');
}

function handleNotFound(req, res) {
    res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8'
    });
    res.end('404 - File Not Found');
}

function handleBadRequest(req, res) {
    res.writeHead(400, {
        'Content-Type': 'text/plain; charset=utf-8'
    });
    res.end('400 - Bad Request');
}

function handleHome(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    res.end(pug.renderFile('./views/home.pug', {}));
}

function handleScore(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    // res.end(pug.renderFile('./views/score.pug', {}));

    Log.findAll({order:[['id', 'DESC']]}).then((posts) => {
        res.end(pug.renderFile('./views/score.pug', {
            posts: posts
            // counter: counter,
            // q: q,
            // a: a,
            // hint: hint,
            // user_answer: user_answer
        }));
    });
}


module.exports = {
    handleLogout: handleLogout,
    handleNotFound: handleNotFound,
    handleBadRequest: handleBadRequest,
    handleHome: handleHome,
    handleScore: handleScore
};