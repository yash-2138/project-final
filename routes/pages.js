const express = require('express')
const {requireAuth, checkUser} = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/',checkUser, (req,res)=>{
    res.render('home',{email: req.email, userType: req.userType, name: req.userName})
})
router.get('/home',checkUser, (req,res)=>{
    res.render('home',{email: req.email, userType: req.userType, name: req.userName})
})
router.get('/login', (req,res)=>{
    res.render('login')
})
router.get('/sender', requireAuth,(req,res)=>{
    res.render('sender',{email: req.email, userType: req.userType, name: req.userName})
})
router.get('/receiver',requireAuth, (req,res)=>{
    res.render('receiver',{email: req.email, userType: req.userType, name: req.userName})
})
router.get('/encryption',requireAuth, (req,res)=>{
    res.render('encryption',{email: req.email, userType: req.userType, name: req.userName})
})
router.get('/marketplace',requireAuth, (req,res)=>{
    res.render('marketplace',{email: req.email, userType: req.userType, name: req.userName})
})
router.get('/storage-form',requireAuth, (req,res)=>{
    res.render('storageForm',{email: req.email, userType: req.userType, name: req.userName})
})
router.get('/aboutus',checkUser, (req,res)=>{
    res.render('aboutus',{email: req.email, userType: req.userType, name: req.userName})
})
router.get('/services',checkUser, (req,res)=>{
    res.render('services',{email: req.email, userType: req.userType, name: req.userName})
})
router.get('/stats',requireAuth, (req,res)=>{
    res.render('stats',{type: req.userType, email: req.email, userType: req.userType, name: req.userName})
})


module.exports = router