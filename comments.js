// Create web server
// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var comments = require('./comments.json');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    switch(path) {
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('Hello, World.');
            response.end();
            break;
        case '/api/comments':
            if (request.method === 'POST') {
                var body = '';
                request.on('data', function(data) {
                    body += data;
                    if (body.length > 1e6) {
                        request.connection.destroy();
                    }
                });
                request.on('end', function() {
                    var post = qs.parse(body);
                    comments.push(post);
                    fs.writeFileSync('comments.json', JSON.stringify(comments));
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write('OK');
                    response.end();
                });
            } else {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.write(JSON.stringify(comments));
                response.end();
            }
            break;
        default:
            response.writeHead(404);
            response.write('Not found');
            response.end();
            break;
    }
});

// Listen on port 8000, IP defaults to