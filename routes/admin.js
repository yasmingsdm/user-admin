const session = require('express-session')
const formidable = require('express-formidable')
const dev = require('../config/config')
const { loggedin, loggedout } = require('../middlewares/auth')
const { loginAdmin, logoutAdmin, getAllUsers } = require('../controllers/admin')

const router = require('express').Router()

router.use(session({
  name: 'admin_session',
  secret: dev.sessionKey || 'VBELUBVRTVIG5BTR55',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60*6000 } //1h
}))

  router.post('/login', loggedout,  loginAdmin)
  router.get('/logout', loggedin, logoutAdmin)
  router.get('/dashboard/all-users', loggedin, getAllUsers)

 module.exports = router