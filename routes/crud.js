const express = require('express')
const crudController = require('../controllers/crudController.js')
const {checkUser} = require('../middleware/authMiddleware.js')

const router = express.Router()

router.post('/addStorage',checkUser,crudController.addStorage)
router.get('/getStats',checkUser, crudController.getStats)
router.get('/getFilesSO',checkUser, crudController.getFilesSO)
router.get('/getFilesDO',checkUser, crudController.getFilesDO)
router.post('/addFiles',checkUser, crudController.addFiles)
router.get('/getMyStorageProvider',checkUser, crudController.getMyStorageProvider)
router.get('/getMyDataOwner',checkUser, crudController.getMyDataOwner)
router.put('/updateCapacity', crudController.updateRemainingCapacity)
router.post('/checkHash',checkUser, crudController.checkHash)
router.post('/updatePossession',checkUser, crudController.updatePossession)


module.exports = router