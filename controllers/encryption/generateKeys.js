const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Check if the key file already exists
const keyFilePath = path.join(__dirname, 'secretKey.txt');

if (!fs.existsSync(keyFilePath)) {
    // Generate a random key and save it to a file (for demonstration purposes)
    const key = crypto.randomBytes(32); // 256-bit key for AES-256
    fs.writeFileSync(keyFilePath, key.toString('hex'), 'utf-8');

    console.log('Key generated and saved securely.');
} else {
    console.log('Key already exists. No need to generate a new one.');
}
