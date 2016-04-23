var express = require('express');
var app = express();

var getContent = function(url, callback) {
  var content = '';
  var server_path = '/var/www/prerender/phantom-server.js';
  if (url.indexOf("http://localhost") == 0) {
	  server_path = 'D:/projects/bundolo/git/bundolo-client/src/main/scripts/prerender/phantom-server.js';
  }
  var phantom = require('child_process').spawn('phantomjs', [server_path, url]);
  phantom.stdout.setEncoding('utf8');
  phantom.stdout.on('data', function(data) {
    content += data.toString();
  });
  phantom.on('exit', function(code) {
    if (code !== 0) {
      console.log('We have an error');
    } else {
      callback(content);
    }
  });
};

var respond = function (req, res) {
  var url = 'http://' + req.headers['x-forwarded-host'] + req.originalUrl;
  getContent(url, function (content) {
    res.send(content);
  });
};

app.get(/(.*)/, respond);
app.listen(3000);
