const express = require('express')
const authController = require('../controllers/auth.js')
const {requireAuth} = require('../middleware/authMiddleware.js')

const router = express.Router()

router.get('/getName', authController.getName )

router.post('/register', authController.register)

router.post('/login',authController.login)

router.get('/logout', authController.logout)

module.exports = router