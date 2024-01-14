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

module.exports = router