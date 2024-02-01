const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const encryptFileModule = require('./encryption/encryptionModule');
const decryptFileModule = require('./encryption/decryptionModule')



exports.getKey = (req,res)=>{
    try {
        const key = crypto.randomBytes(32);
        res.send({key: key.toString('hex')})  
    } catch (error) {
        res.status(500).json(error)
    }    
}

exports.encryptFile = async (req, res) => {
    try{
        const {keyFile} =req.body; 
        const generatedFileName = req.generatedFileName
        const originalExtension = path.extname(generatedFileName);
        const inputFile = path.join(__dirname, '..', 'temp', generatedFileName);
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const encryptedFile =path.join(__dirname, '..', 'temp', `${timestamp}_decryptedOutput.enc`); 

        fs.writeFile(encryptedFile, '', (err) => {
            if (err) {
                console.error(`Error creating file: ${err}`);
            } else {
                
                console.log(`${encryptedFile} file created successfully in the current directory.`);
            }
        });
        const result = await encryptFileModule(inputFile, encryptedFile, keyFile, originalExtension);
        fs.readFile(encryptedFile, (err, data) => {
            if (err) {
                return res.status(500).send('Error reading the uploaded file');
            }
            // Send the file content as the response
            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', `attachment; filename=encryptedOutput.enc`);
            res.send(data);
    
            
            fs.unlink(inputFile, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error deleting input file:', unlinkErr);
                }
            });
            fs.unlink(encryptedFile, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error deleting ouput file:', unlinkErr);
                }
            });
        });
    } catch (error) {
        res.status(400).json({ error:error });
    }
    
};

exports.decryptFile = async (req,res)=>{
    const {keyFile} =req.body;
    const generatedFileName = req.generatedFileName
    

    try {
        const encryptedFile = path.join(__dirname, '..', 'temp', generatedFileName);
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const decryptedFile =path.join(__dirname, '..', 'temp', `${timestamp}_decryptedFile`); 

        fs.writeFile(decryptedFile, '', (err) => {
            if (err) {
                console.error(`Error creating file: ${err}`);
            } else {
                // console.log(`${decryptedFile} file created successfully in the current directory.`);
            }
        });
        const outputPath = await decryptFileModule(encryptedFile, decryptedFile, keyFile)
        const pathComponents = outputPath.split('\\');
        const filenameWithExtension = pathComponents[pathComponents.length - 1];
        fs.readFile(outputPath, (err, data) => {
            if (err) {
                return res.status(500).send('Error reading the uploaded file');
            }
            // Send the file content as the response
            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', `attachment; filename=${filenameWithExtension}`);
            res.send(data);
    
            
            fs.unlink(outputPath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error deleting output file:', unlinkErr);
                }
            });
            fs.unlink(encryptedFile, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error deleting input file:', unlinkErr);
                }
            });
        });
        
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}