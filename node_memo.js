'use strict';
const http = require('http');
+const auth = require('http-auth');
const router = require('./lib/router');

-const server = http.createServer((req, res) => {
+const basic = auth.basic({
+  realm: 'Enter username and password.',
+  file: './users.htpasswd'
+});
+
+const server = http.createServer(basic, (req, res) => {
  router.route(req, res);
}).on('error', (e) => {
  console.error('Server Error', e);


  /posts 以外へのアクセスをハンドリングする必要があるので、 handler-util という /posts 以外のリクエストをハンドリングするモジュールも作成しましょう。
  すでに起動したものを Ctrl + c で終了した後、
  
  touch lib/handler-util.js
  以上でファイルを作って、 lib/router.js を以下の変更差分のように編集します。
  
   'use strict';
   const postsHandler = require('./posts-handler');
  +const util = require('./handler-util');
  
   function route(req, res) {
     switch (req.url) {
       case '/posts':
         postsHandler.handle(req, res);
         break;
  +    case '/logout':
  +      util.handleLogout(req, res);
  +      break;
       default:
         break;
     }
  
  
  次に、 lib/handler-util.js を以下のように実装します。
  
  handler-util.js
  'use strict';
  
  function handleLogout(req, res) {
    res.writeHead(401, {
      'Content-Type': 'text/plain; charset=utf-8'
    });
    res.end('ログアウトしました');
  }
  
  module.exports = {
    handleLogout: handleLogout
  };
  これは、ステータスコード 401 - Unauthorized を返し、その後「ログアウトしました」というテキストをレスポンスに書き込むモジュールです。
  
  最後に、テンプレートにも変更を加えます。 views/posts.pug を以下の変更差分のように編集します。
  
       title 秘密の匿名掲示板
     body
       h1 秘密の匿名掲示板
  +    a(href="/logout") ログアウト
       h2 新規投稿
       form(method="post" action="/posts")
         div
  

         case '/logout':
         util.handleLogout(req, res);
         break;
       default:
  +      util.handleNotFound(req, res);
         break;
     }
   }
  ここでは、handleNotFound という関数がある前提で実装しています。
  
  次に、lib/handler-util.js にも以下の実装を行います。
  
   function handleLogout(req, res) {
     res.end('ログアウトしました');
   }
  
  +function handleNotFound(req, res) {
  +  res.writeHead(404, {
  +    'Content-Type': 'text/plain; charset=utf-8'
  +  });
  +  res.end('ページがみつかりません');
  +}
  +
   module.exports = {
  -  handleLogout: handleLogout
  +  handleLogout: handleLogout,
  +  handleNotFound: handleNotFound
   };

   h2 新規投稿
   form(method="post" action="/posts")
     div
       textarea(name="content" cols=40 rows=4)
     div
       button(type="submit") 投稿
+
+  h2 投稿一覧
+  each content in contents
+    p #{content}
+    hr


lib/posts-handler.js:
 'use strict';
 const pug = require('pug');
+const util = require('./handler-util');
 const contents = [];
lib/posts-handler.js:
     default:
+      util.handleBadRequest(req, res);
       break;
   }
lib/handler-util.js:
+function handleBadRequest(req, res) {
+  res.writeHead(400, {
+    'Content-Type': 'text/plain; charset=utf-8'
+  });
+  res.end('未対応のメソッドです');
+}
+
 module.exports = {
   handleLogout: handleLogout,
-  handleNotFound: handleNotFound
+  handleNotFound: handleNotFound,
+  handleBadRequest: handleBadRequest
 };