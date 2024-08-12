const http = require('node:http');
const fs = require('node:fs');
const url = require('node:url');
const pg = require('pg');

const hostname = 'https://cognition-a0e89b43ca6a.herokuapp.com/';
const port = process.env.PORT || 8080;

const pgClient = new pg.Client({
	connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/cognition',
	ssl: process.env.DATABASE_URL ? true : false
});

pgClient.connect();

const server = http.createServer((req, res) => {
	const pathname = url.parse(req.url).pathname;

	// Function to serve files
	const serveFile = (filePath, contentType) => {
		fs.readFile(filePath, (err, data) => {
			if (err) {
				console.error(err.stack);
				res.writeHead(500, { 'Content-Type': 'text/plain' });
				res.end('500 Internal Server Error');
			} else {
				res.writeHead(200, { 'Content-Type': contentType });
				res.end(data);
			}
		});
	};

	if (req.method === 'GET') {
		if (pathname === '/') {
			serveFile('./html/index.html', 'text/html; charset=utf-8');
		} else if (pathname === '/instructions') {
			serveFile('./html/instructions.html', 'text/html; charset=utf-8');
		} else if (pathname === '/test') {
			serveFile('./html/test.html', 'text/html; charset=utf-8');
		} else if (pathname === '/style.css') {
			serveFile('./styles/style.css', 'text/css');
		} else if (pathname === '/instructions.js') {
			serveFile('./script/instructions.js', 'application/javascript');
		} else if (pathname === '/test.js') {
			serveFile('./script/test.js', 'application/javascript');
		} else {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end('404 page not found');
		}
	} else if (req.method === 'POST' && pathname === '/submitdata') {
		let body = '';

		req.on('data', chunk => {
			body += chunk.toString();
		});

		req.on('end', async () => {
			try {
				const data = JSON.parse(body);

				// Insert data into the database
				for (let i = 0; i < data.coordx.length; i++) {
					await pgClient.query(
						'INSERT INTO test_results (patientid, coordx, coordy, coordt, realpointid, realpointx, realpointy, fakepointid, fakepointx, fakepointy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
						[data.patientid, data.coordx[i], data.coordy[i], data.coordt[i], data.realpointid[i], data.realpointx[i], data.realpointy[i], data.fakepointid[i], data.fakepointx[i], data.fakepointy[i]]
					);
				}

				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end('Data successfully submitted');
			} catch (error) {
				console.error(error.stack);
				res.writeHead(500, { 'Content-Type': 'text/plain' });
				res.end('500 Internal Server Error');
			}
		});
	} else {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('404 page not found');
	}
});

server.listen(port, () => {
	//console.log(`Server running at http://${hostname}:${port}/`);
});


