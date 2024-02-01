const path = require('path');
const encryptFile = require('./encryptionModule');
const fs = require('fs');

const inputFile = path.join(__dirname, 'login.css');
const encryptedFile = path.join(__dirname, 'encryptedFile.enc');
const keyFilePath = path.join(__dirname, 'secretKey.txt');

// Retrieve the key from the file
const key = Buffer.from(fs.readFileSync(keyFilePath, 'utf-8'), 'hex');

// Get the original file extension
const originalExtension = path.extname(inputFile);

// Encrypt the file with the original extension information
encryptFile(inputFile, encryptedFile, key, originalExtension);

console.log('File encrypted.');
