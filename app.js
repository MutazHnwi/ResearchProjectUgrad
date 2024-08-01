const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const url = require('node:url');
const pg = require('pg');
const bodyParser = require('body-parser');

const hostname = 'localhost';
const port = '8080';

const pgClient = new pg.Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

pgClient.connect();

const server = http.createServer((req, res) => {

	// Request Handling
	req.on('error', err => {
			console.error(err.stack);
	}).on('end', () => {
		const pathname = url.parse(req.url).pathname;

		// response
		if (req.method === 'GET' && pathname === '/') { // index path (our.website.com/)
			fs.readFile('./html/index.html', (err, data) => {
				if (err) { // log and send back an error if file can't be read
					console.error(err.stack);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
					});
					res.write('500 Internal Server Error (unable to read index.html)');
					res.end();
				} else { // send back index.html
					res.writeHead(200, {
						'Content-Type': 'text/html; charset=utf-8',
					});
					res.write(data);
					res.end();
					console.log(req.method + ' ' + pathname);
				}
			});
		} else if (req.method === 'GET' && pathname === '/instructions') { // instructions path (our.website.com/instructions
			fs.readFile('./html/instructions.html', (err, data) => {
				if (err) { // log and send back an error if file can't be read
					console.error(err.stack);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
					});
					res.write('500 Internal Server Error (unable to read instructions.html)');
					res.end();
				} else { // send back instructions.html
					res.writeHead(200, {
						'Content-Type': 'text/html; charset=utf-8',
					});
					res.write(data);
					res.end();
					console.log(req.method + ' ' + pathname);
				}
			});
		} else if (req.method === 'GET' && pathname === '/test') { // test path (our.website.com/test)
			fs.readFile('./html/test.html', (err, data) => {
				if (err) { // log and send back an error if file can't be read
					console.error(err.stack);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
					});
					res.write('500 Internal Server Error (unable to read test.html)');
					res.end();
				} else { // send back test.html
					res.writeHead(200, {
						'Content-Type': 'text/html; charset=utf-8',
					});
					res.write(data);
					res.end();
					console.log(req.method + ' ' + pathname);
				}
			});
		} else if (req.method === 'GET' && pathname === '/style.css') { // style.css path (our.website.com/style.css) (background request)
			fs.readFile('./styles/style.css', (err, data) => {
				if (err) { // log and send back an error if file can't be read
					console.error(err.stack);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
					});
					res.write('500 Internal Server Error (unable to read test.html)');
					res.end();
				} else { // send back style.css
					res.writeHead(200, {
						'Content-Type': 'text/css',
					});
					res.write(data);
					res.end();
					console.log(req.method + ' ' + pathname);
				}
			});
		} else if (req.method === 'GET' && pathname === '/instructions.js') { // instructions.js path (our.website.com/instructions.js) (background request)
			fs.readFile('./script/instructions.js', (err, data) => {
				if (err) { // log and send back an error if file can't be read
					console.error(err.stack);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
					});
					res.write('500 Internal Server Error (unable to read test.html)');
					res.end();
				} else { // send back instructions.js
					res.writeHead(200, {
						'Content-Type': 'application/javascript',
					});
					res.write(data);
					res.end();
					console.log(req.method + ' ' + pathname);
				}
			});
		} else if (req.method === 'GET' && pathname === '/test.js') { // test.js path (our.website.com/test.js) (background request)
			fs.readFile('./script/test.js', (err, data) => {
				if (err) { // log and send back an error if file can't be read
					console.error(err.stack);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
					});
					res.write('500 Internal Server Error (unable to read test.html)');
					res.end();
				} else { // send back test.js
					res.writeHead(200, {
						'Content-Type': 'application/javascript',
					});
					res.write(data);
					res.end();
					console.log(req.method + ' ' + pathname);
				}
			});
		} else if (req.method === 'POST' && pathname === '/submitdata') { // submitdata path for POST only (our.website.com/submitdata with POST method) (done by test.js after the user has completed the test)
			
		} else {
			res.writeHead(404, {
				'Content-Type': 'text/plain',
			});
			res.write('404 page not found');
			res.end();
			console.log(req.method + ' ' + pathname + ' 404');
		}
	});
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
