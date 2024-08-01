const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const url = require('node:url');
const pg = require('pg');

const hostname = 'localhost';
const port = '8080';

const pgClient = new pg.Client({
	user: 'postgres',
	database: 'cognition', 
	ssl: {
		rejectUnauthorized: false
	}
});

pgClient.connect();

const server = http.createServer((req, res) => {

	// Request Handling
	req.on('error', err => {
			console.error(err.stack);
	}).on('data', chunk => {
	}).on('end', () => {
		const pathname = url.parse(req.url).pathname;

		// response
		if (req.method === 'GET' && pathname === '/') {
			fs.readFile('./html/index.html', (err, data) => {
				if (err) {
					console.error(err.stack);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
					});
					res.write('500 Internal Server Error (unable to read index.html)');
					res.end();
				} else {
					res.writeHead(200, {
						'Content-Type': 'text/html; charset=utf-8',
					});
					res.write(data);
					res.end();
					console.log(data);
				}
			});
		} else if (req.method === 'GET' && pathname === '/instructions') {
			fs.readFile('./html/instructions.html', (err, data) => {
				if (err) {
					console.error(err.stack);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
					});
					res.write('500 Internal Server Error (unable to read instructions.html)');
					res.end();
				} else {
					res.writeHead(200, {
						'Content-Type': 'text/html; charset=utf-8',
					});
					res.write(data);
					res.end();
					console.log(data);
				}
			});
		} else if (req.method === 'GET' && pathname === '/test') {
			fs.readFile('./html/test.html', (err, data) => {
				if (err) {
					console.error(err.stack);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
					});
					res.write('500 Internal Server Error (unable to read test.html)');
					res.end();
				} else {
					res.writeHead(200, {
						'Content-Type': 'text/html; charset=utf-8',
					});
					res.write(data);
					res.end();
					console.log(data);
				}
			});
		} else if (req.method === 'GET' && pathname === '/style.css' {
			fs.readFile('./styles/style.css', (err, data) => {
				if (err) {
					console.error(err.stack);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
					});
					res.write('500 Internal Server Error (unable to read test.html)');
					res.end();
				} else {
					res.writeHead(200, {
						'Content-Type': 'text/css',
					});
					res.write(data);
					res.end();
					console.log(data);
				}
			});
		} else if (req.method === 'GET' && pathname === '/instructions.js') {
			fs.readFile('./script/instructions.js', (err, data) => {
				if (err) {
					console.error(err.stack);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
					});
					res.write('500 Internal Server Error (unable to read test.html)');
					res.end();
				} else {
					res.writeHead(200, {
						'Content-Type': 'application/javascript',
					});
					res.write(data);
					res.end();
					console.log(data);
				}
			});
		} else if (req.method === 'GET' && pathname === '/test.js') {
			fs.readFile('./script/test.js', (err, data) => {
				if (err) {
					console.error(err.stack);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
					});
					res.write('500 Internal Server Error (unable to read test.html)');
					res.end();
				} else {
					res.writeHead(200, {
						'Content-Type': 'application/javascript',
					});
					res.write(data);
					res.end();
					console.log(data);
				}
			});
		} else if (req.method === 'POST' && pathname === '/submitdata') {
		
		} else {
			res.writeHead(404, {
				'Content-Type': 'text/plain',
			});
			res.write('404 page not found');
			res.end();
		}
	}
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
