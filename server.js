const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const WALLETS_FILE = path.join(__dirname, 'wallets.csv');

// Initialize CSV file if it doesn't exist
if (!fs.existsSync(WALLETS_FILE)) {
    fs.writeFileSync(WALLETS_FILE, 'Wallet Address,Total SAKURA Claimed,Number of Claims,Timestamp,Date\n');
    console.log('Created wallets.csv file');
}

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Handle wallet submission
    if (req.method === 'POST' && req.url === '/submit-wallet') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const wallet = data.wallet;
                const sakuraAmount = data.sakuraAmount || 0;
                const claimCount = data.claimCount || 0;
                const timestamp = data.timestamp || new Date().toISOString();
                const date = data.date || new Date().toLocaleString();

                // Check if wallet already exists
                const fileContent = fs.readFileSync(WALLETS_FILE, 'utf8');
                if (fileContent.includes(wallet)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Wallet already exists' }));
                    return;
                }

                // Append to CSV file
                const csvLine = `${wallet},${sakuraAmount},${claimCount},${timestamp},${date}\n`;
                fs.appendFileSync(WALLETS_FILE, csvLine);

                console.log(`✅ Wallet added: ${wallet} - ${sakuraAmount} SAKURA (${claimCount} claims)`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Wallet saved successfully' }));
            } catch (error) {
                console.error('Error saving wallet:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to save wallet' }));
            }
        });
    }
    // Serve the HTML file
    else if (req.method === 'GET' && req.url === '/') {
        const htmlPath = path.join(__dirname, 'index.html');
        fs.readFile(htmlPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    // Serve static files (music, gif, etc.)
    else if (req.method === 'GET') {
        const filePath = path.join(__dirname, req.url);
        const extname = path.extname(filePath);
        const contentTypes = {
            '.mp3': 'audio/mpeg',
            '.gif': 'image/gif',
            '.jpg': 'image/jpeg',
            '.png': 'image/png',
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript'
        };
        const contentType = contentTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    }
    else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`💾 Wallets will be saved to: ${WALLETS_FILE}`);
});
