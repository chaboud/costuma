const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.glb': 'model/gltf-binary'
};

// Create self-signed certificate if it doesn't exist
const certPath = './server.crt';
const keyPath = './server.key';

function createSelfSignedCert(callback) {
    console.log('Creating self-signed certificate...');
    const cmd = `openssl req -x509 -newkey rsa:2048 -keyout ${keyPath} -out ${certPath} -days 365 -nodes -subj "/C=US/ST=Local/L=Local/O=Dev/CN=localhost"`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error('Error creating certificate:', error);
            callback(error);
            return;
        }
        console.log('Certificate created successfully!');
        callback(null);
    });
}

function startServer() {
    // Check if certificates exist
    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
        createSelfSignedCert((err) => {
            if (err) {
                console.log('Failed to create certificates, falling back to HTTP...');
                startHttpServer();
                return;
            }
            startHttpsServer();
        });
    } else {
        startHttpsServer();
    }
}

function startHttpsServer() {
    try {
        const options = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        };

        const server = https.createServer(options, (req, res) => {
            handleRequest(req, res);
        });

        server.listen(8443, () => {
            console.log('🔒 HTTPS Server running at https://localhost:8443');
            console.log('📷 Camera access should work over HTTPS!');
            console.log('⚠️  You\'ll need to accept the self-signed certificate warning in your browser');
        });
    } catch (error) {
        console.error('HTTPS server failed:', error);
        console.log('Falling back to HTTP server...');
        startHttpServer();
    }
}

function startHttpServer() {
    const server = http.createServer((req, res) => {
        handleRequest(req, res);
    });

    server.listen(8080, () => {
        console.log('🌐 HTTP Server running at http://localhost:8080');
        console.log('📷 Camera access may be limited over HTTP');
        console.log('💡 Try Chrome which allows camera on localhost, or use the HTTPS version');
    });
}

function handleRequest(req, res) {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            });
            res.end(content, 'utf-8');
        }
    });
}

startServer();