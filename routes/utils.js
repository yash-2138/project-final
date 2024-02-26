const express = require('express')
const utilsController = require('../controllers/utilsController.js')
const {checkUser} = require('../middleware/authMiddleware.js')
const router = express.Router()

router.post('/sendMail',checkUser, utilsController.sendMailToMyStorageProvider)
router.post('/fileRequest',checkUser, utilsController.requestFile)


module.exports = router