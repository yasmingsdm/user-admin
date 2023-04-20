const { signUpUser, VerifyEmail } = require('../controllers/users')
const formidable = require('express-formidable')

const router = require('express').Router()

  router.post('/signup', formidable(), signUpUser)
  router.post('/verify-email', VerifyEmail)

 module.exports = router