const express = require('express')
const encryptionController = require('../controllers/encryptionController.js')


const router = express.Router()

router.get('/getKey', encryptionController.getKey)


module.exports = router