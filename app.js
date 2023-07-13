const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;














const server = http.createServer((req, res) => {
  // Serve static files
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'index.html');
    const contentType = 'text/html';

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Error: File not found');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data);
        res.end();
      }
    });
  }
   else if (req.url === '/api/data') {
    if (req.method === 'GET') {
      const filePath = path.join(__dirname, 'data.json');
      const contentType = 'application/json';

      fs.readFile(filePath, (error, data) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.write('Error: Unable to read JSON file');
          res.end();
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.write(data);
          res.end();
        }
      });
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const filePath = path.join(__dirname, 'data.json');

        fs.writeFile(filePath, body, (error) => {
          if (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write('Error: Unable to write JSON file');
            res.end();
          } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('JSON data written successfully');
            res.end();
          }
        });
      });
    }
  }
   else if (req.url === '/style.css') {
    const filePath = path.join(__dirname, 'style.css');
    const contentType = 'text/css';

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Error: File not found');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data);
        res.end();
      }
    });
  } else if (req.url === '/index.js') {
    const filePath = path.join(__dirname, 'index.js');
    const contentType = 'text/javascript';

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Error: File not found');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data);
        res.end();
      }
    });
  }else if (req.url === '/trash-bin.svg') {
    const filePath = path.join(__dirname, 'trash-bin.svg');
    const contentType = 'image/svg+xml';
  
    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Error: File not found');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data);
        res.end();
      }
    });
  }
   else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Error: File not found');
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
