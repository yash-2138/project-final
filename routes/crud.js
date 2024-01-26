const express = require('express')
const crudController = require('../controllers/crudController.js')

const router = express.Router()

router.post('/addStorage',crudController.addStorage)
router.put('/updateCapacity', crudController.updateRemainingCapacity)


module.exports = router