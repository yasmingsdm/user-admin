const { signUpUser } = require('../controllers/users')
const formidable = require('express-formidable')

const router = require('express').Router()

 router.post('/signup', formidable(), signUpUser)

 module.exports = router