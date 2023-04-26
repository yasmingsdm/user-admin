const User = require("../models/users")

const loggedin = (req,res,next)=>{
    try {
        if(!req.session.userId){
            return res.status(400).json({message: 'Login first'})
        }next()
        
    } catch (error) {
        console.log(error)
    }
}

const loggedout = (req,res,next)=>{
    try {
        if(req.session.userId){
            return res.status(400).json({message: 'Logout first'})
        }
       next()
    } catch (error) {
        console.log(error)
    }
}

const isAdmin = async(req,res,next)=>{
    try {
        if(!req.session.userId){
            return res.status(400).json({message: 'Login first'})
        }
        const checkAdmin = await User.findById(req.session.userId)
        if(checkAdmin.is_admin === 0){
            return res.status(401).json({message: 'You cannot do that'})
        }
       next()
    } catch (error) {
        console.log(error)
    }
}

module.exports = {loggedin, loggedout, isAdmin}