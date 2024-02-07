const express = require('express')
const {requireAuth} = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/', (req,res)=>{
    res.render('home')
})
router.get('/home', (req,res)=>{
    res.render('home')
})
router.get('/login', (req,res)=>{
    res.render('login')
})
router.get('/sender', requireAuth,(req,res)=>{
    res.render('sender')
})
router.get('/receiver',requireAuth, (req,res)=>{
    res.render('receiver')
})
router.get('/encryption',requireAuth, (req,res)=>{
    res.render('encryption')
})
router.get('/marketplace',requireAuth, (req,res)=>{
    res.render('marketplace')
})
router.get('/storage-form',requireAuth, (req,res)=>{
    res.render('storageForm')
})
router.get('/aboutus', (req,res)=>{
    res.render('aboutus')
})
router.get('/services', (req,res)=>{
    res.render('services')
})
router.get('/stats',requireAuth, (req,res)=>{
    res.render('stats')
})


module.exports = router