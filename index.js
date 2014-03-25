'use strict';

var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var cwd = process.cwd();
var port = process.argv[2] || 8080;

app.get('*', function (req, res, next) {
	var file = path.join(cwd, req.url);

	fs.stat(file, function (err, stats) {
		if (err) {
			console.log('[404]', file);
		} else {
			console.log('[200]', file);
		}

		if (stats && stats.isDirectory()) {
			fs.exists(path.join(file, 'index.html'), function (exists) {
				if (exists) {
					var redirect = 'http://' + req.headers.host + req.url + '/index.html';
					console.log('redirecting to', redirect);
					res.redirect(redirect);
				} else {
					next();
				}
			});
		} else {
			next();
		}
	});
});

app.use(express.directory(cwd));
app.use(express.static(cwd));

app.listen(port, function () {
	console.log('static web server running: http://localhost:' + port + '/');
});
