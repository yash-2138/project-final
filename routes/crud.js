const express = require('express')
const crudController = require('../controllers/crudController.js')
const {checkUser} = require('../middleware/authMiddleware.js')

const router = express.Router()

router.post('/addStorage',checkUser,crudController.addStorage)
router.get('/getStats',checkUser, crudController.getStats)
router.put('/updateCapacity', crudController.updateRemainingCapacity)


module.exports = router