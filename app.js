const express = require('express')
const cookieParser = require('cookie-parser')
const path  = require('path')
const http = require('http');
const socketIO = require('socket.io');
// const dbClient = require("./db.js")
const socketController = require('./controllers/socketController');
const pageRouter = require('./routes/pages.js')
const authRouter = require('./routes/auth.js')
const blockchainRouter = require('./routes/blockchain.js')

const app = express()
const server = http.createServer(app)
const  io = socketIO(server)
let port = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(express.static(path.join(__dirname+"/public")))
app.set('view engine', 'ejs')

socketController(io);

app.use('/', pageRouter)
app.use('/auth', authRouter)


console.log(port)
server.listen(port)