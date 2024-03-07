const express = require('express')
const authController = require('../controllers/auth.js')
const {checkUser} = require('../middleware/authMiddleware.js')

const router = express.Router()

router.get('/getName',checkUser, authController.getName )

router.post('/register', authController.register)

router.post('/login',authController.login)

router.get('/logout', authController.logout)

module.exports = router