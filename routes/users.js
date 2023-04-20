const { signUpUser, VerifyEmail, loginUser, logoutUser } = require('../controllers/users')
const session = require('express-session')
const formidable = require('express-formidable')

const router = require('express').Router()

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
  router.post('/signup', formidable(), signUpUser)
  router.post('/verify-email', VerifyEmail)
  router.post('/login', loginUser)
  router.get('/logout', logoutUser)

 module.exports = router