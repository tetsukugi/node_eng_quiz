'use strict';
const pug = require('pug');
const util = require('./handler-util');
const Log = require('./log');

const answers = [];

const words = {a1:['red','apple'],a2:['japan','tokyo']};

let counter = 1;
let q = words.a1[1];
let a = words.a1[0];
let hint = a;
let user_answer = '';
let judge = "judge";


function handle(req, res) {
    switch (req.method) {
        case 'GET':
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            // res.end(pug.renderFile('./views/quiz.pug', {contents: contents}));
            Log.findAll({order:[['id', 'DESC']]}).then((posts) => {
                res.end(pug.renderFile('./views/quiz.pug', {
                    posts: posts,
                    counter: counter,
                    q: q,
                    a: a,
                    hint: hint,
                    user_answer: user_answer
                }));
            });
            break;
        case 'POST':
            let body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                const decoded = decodeURIComponent(body);
                const answer = decoded.split('answer=')[1];
                console.info('counter: ' + counter);
                console.info('user_answer: ' + answer);
                answers.push(answer);
                // console.info('answers: ' + answers);
                // counter = counter + 1;
                if( answer == a )
                    judge = 'correct';
                else
                    judge = 'wrong';

                Log.create({
                    judge: judge,
                    count: counter,
                    user: req.user
                }).then(() => {
                    counter = counter + 1;
                    user_answer = answer;
                    handleRedirectPosts(req, res);
                });
            });
            break;
        default:
            util.handleBadRequest(req, res);
            break;
    }
}

function handleRedirectPosts(req, res) {
    res.writeHead(303, {
        'Location': '/quiz'
    });
    res.end();
}

module.exports = {
    handle: handle
};