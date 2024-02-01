const express = require('express')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const encryptionController = require('../controllers/encryptionController.js')

const parentDirectory = path.join(__dirname, '..');
const tempFolder = path.join(parentDirectory, 'temp');

if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder);
}

const storage = multer.diskStorage({
    destination: tempFolder,
    filename: (req, file, callback) => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const generatedFileName = `${timestamp}_${file.originalname}`;
        req.generatedFileName = generatedFileName; // Store the generated filename in the request object
        callback(null, generatedFileName);
    }
}); 
const upload = multer({ storage: storage })

const router = express.Router()

router.get('/getKey', encryptionController.getKey)
router.post('/encryptFile',upload.fields([ { name: 'inputFile', maxCount: 1 }]), encryptionController.encryptFile)
router.post('/decryptFile',upload.fields([ { name: 'encryptedFile', maxCount: 1 }]), encryptionController.decryptFile)


module.exports = router