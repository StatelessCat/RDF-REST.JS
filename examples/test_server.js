// jshint node: true

// a simple HTTP server for testing purposes

var http = require('http');

var PORT = 12345;
var MAX_AGE = 3;

var data = []
var dataVersion = 0;

var server = http.createServer(function (req, res) {

  var body = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
      body += chunk;
  });
  req.on('end', function () {
      var msg;
      if (req.url === "/303") {
          if (req.method !== "GET" && req.method !== "HEAD") {
              res.statusCode = 400;
              msg = 'unsupported method ' + req.method;
              console.log(msg);
              res.write(msg);
          } else {
              res.statusCode = 303;
              res.setHeader('location', '/');
          }
      } else if (req.method === "GET" || req.method === "HEAD" || req.method === 'PUT') {
          var etag = '"a' + dataVersion + '"';
          if (req.method === 'PUT') {
              try {
                  data = JSON.parse(body);
                  dataVersion += 1;
              }
              catch (err) {
                  res.statusCode = 400;
                  var msg = 'parse error: ' + err;
                  console.log("--- " + msg);
                  res.write(msg);
                  res.end();
                  return;
              }
          }
          res.setHeader('Cache-Control', "max-age=" + MAX_AGE);
          res.setHeader('Etag', etag);
          var reqEtag = req.headers['if-none-match'];
          if (etag === reqEtag) {
              res.statusCode = 304;
          } else {
              if (req.method !== "HEAD") {
                  res.setHeader('Content-type', 'application/json');
                  res.write(JSON.stringify(data));
              }
          }
      } else if (req.method === "POST") {
          try {
              data = JSON.parse(body);
          }
          catch (err) {
              res.statusCode = 400;
              var msg = 'parse error: ' + err;
              console.log("--- " + msg);
              res.write(msg);
          }
          res.setHeader('location', '/created');
          res.end();
      } else if (req.method === "DELETE") {
          data = {};
      } else {
          res.statusCode = 400;
          msg = 'unrecognized method ' + req.method;
          console.log(msg);
          res.write(msg);
      }
      res.end();
  });
  res.on('finish', function() {
      var now = (new Date()).toISOString();
      console.log('%s %s %s -> %d', now, req.method, req.url, res.statusCode);
  });
});

console.log("Listening on " + PORT);
server.listen(PORT);
