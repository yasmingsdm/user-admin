const { signUpUser, VerifyEmail, loginUser, logoutUser } = require('../controllers/users')
const session = require('express-session')
const formidable = require('express-formidable')
const dev = require('../config/config')
const { loggedin, loggedout } = require('../middlewares/auth')

const router = require('express').Router()

router.use(session({
  name: 'user session',
  secret: dev.sessionKey || 'VBELUBVRTVIG5BTR55',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60*6000 } //1h
}))
  router.post('/signup', formidable(), signUpUser)
  router.post('/verify-email', VerifyEmail)
  router.post('/login', loggedout,  loginUser)
  router.get('/logout', loggedin, logoutUser)

 module.exports = router