const express = require('express')
const cookieParser = require('cookie-parser')
const path  = require('path')
const http = require('http');
const socketIO = require('socket.io');
// const fileUpload = require('express-fileupload');

// const dbClient = require("./db.js")
// const socketController = require('./controllers/socketController');
const pageRouter = require('./routes/pages.js')
const authRouter = require('./routes/auth.js')
const blockchainRouter = require('./routes/blockchain.js')
const crudRouter = require('./routes/crud.js')
const encryptionRouter = require('./routes/encryption.js')
const utilsRouter = require('./routes/utils.js')

const app = express()

let port = process.env.PORT || 5000

// app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(express.static(path.join(__dirname+"/public")))
app.set('view engine', 'ejs')

app.use('/', pageRouter)
app.use('/auth', authRouter)
app.use('/crud', crudRouter)
app.use('/service',encryptionRouter)
app.use('/utils',utilsRouter)


console.log(port)
app.listen(port)