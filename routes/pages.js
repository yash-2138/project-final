const express = require('express')
const router = express.Router()

router.get('/register', (req, res)=>{
    res.render("register")
})

router.get('/login', (req,res)=>{
    res.render("login")
})
router.get('/sender',(req,res)=>{
    res.render('sender')
})
router.get('/receiver', (req,res)=>{
    res.render('receiver')
})
router.get('/home', (req,res)=>{
    res.render('home')
})
router.get('/login', (req,res)=>{
    res.render('login')
})
router.get('/sender', (req,res)=>{
    res.render('sender')
})
router.get('/receiver', (req,res)=>{
    res.render('receiver')
})
router.get('/encryption', (req,res)=>{
    res.render('encryption')
})
router.get('/marketplace', (req,res)=>{
    res.render('marketplace')
})
router.get('/storage-form', (req,res)=>{
    res.render('storageForm')
})
router.get('/aboutus', (req,res)=>{
    res.render('aboutus')
})


module.exports = router