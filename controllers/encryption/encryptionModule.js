const fs = require('fs');
const crypto = require('crypto');

// Function to encrypt a file with original extension information
function encryptFile(inputPath, outputPath, keyFile, originalExtension) {
    const key = Buffer.from(keyFile, 'hex');
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    return new Promise((resolve, reject) =>{
        const iv = crypto.randomBytes(16); // Initialization vector for AES
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        output.write(iv);
        output.write(Buffer.from([originalExtension.length]));
        output.write(Buffer.from(originalExtension, 'utf-8'));

        input.pipe(cipher).pipe(output);
        // Handle errors during encryption
        cipher.on('error', (err) => {
            reject( new Error('Encryption error:', err.message));
            output.end();
        });

        // Handle the end of the encryption process
        output.on('finish', () => {
            console.log('File encrypted successfully.');
            resolve("completed")
        });
    })
    
}

module.exports = encryptFile;
