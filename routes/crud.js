const express = require('express')
const crudController = require('../controllers/crudController.js')
const {checkUser} = require('../middleware/authMiddleware.js')

const router = express.Router()

router.post('/addStorage',checkUser,crudController.addStorage)
router.get('/getStats',checkUser, crudController.getStats)
router.get('/getFilesSO',checkUser, crudController.getFilesSO)
router.get('/getFilesDO',checkUser, crudController.getFilesDO)
router.post('/addFiles',checkUser, crudController.addFiles)
router.put('/updateCapacity', crudController.updateRemainingCapacity)


module.exports = router