const fs = require('fs');
const crypto = require('crypto');

// Function to decrypt a file and save the decrypted content to a file with the original extension
function decryptFile(inputPath, outputPath, keyFile) {
    const key = Buffer.from(keyFile, 'hex');
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    return new Promise((resolve, reject)=>{
        input.once('readable', () => {
            const iv = input.read(16);
            const originalExtensionLength = input.read(1)[0];
            const originalExtension = input.read(originalExtensionLength).toString();
    
            if (!iv || iv.length !== 16 || !originalExtension) {
                reject(new Error('Error reading initialization vector or original file extension'));
                return;
            }
    
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
            // Handle errors during decryption
            decipher.on('error', (err) => {
                reject(new Error(`Decryption error: ${err.message}`));
                output.end();
            });
    
            // Handle the end of the decryption process
            output.on('finish', () => {
                const newOutputPath = `${outputPath}${originalExtension}`;
                fs.renameSync(outputPath, newOutputPath);
                // console.log('File decrypted successfully. New file:', newOutputPath);
                resolve(newOutputPath);
                
            });
    
            // Pipe the decrypted content to the output file
            input.pipe(decipher).pipe(output);
           
            
        });
    })
    // Read the initialization vector and original extension from the beginning of the file
    
}

module.exports = decryptFile;
