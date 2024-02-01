const path = require('path');
const decryptFile = require('./decryptionModule');
const fs = require('fs');

const encryptedFile = path.join(__dirname, 'encryptedFile.enc');
const keyFilePath = path.join(__dirname, 'secretKey.txt');

// Retrieve the key from the file
const key = Buffer.from(fs.readFileSync(keyFilePath, 'utf-8'), 'hex');

console.log('Decrypting...');

// Decrypt the file and save the decrypted content to a text file
decryptFile(encryptedFile, 'decryptedFile', key);
