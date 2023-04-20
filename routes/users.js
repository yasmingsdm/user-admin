const { signUpUser, VerifyEmail, loginUser, logoutUser } = require('../controllers/users')
const formidable = require('express-formidable')

const router = require('express').Router()

  router.post('/signup', formidable(), signUpUser)
  router.post('/verify-email', VerifyEmail)
  router.post('/login', loginUser)
  router.get('/logout', logoutUser)

 module.exports = router