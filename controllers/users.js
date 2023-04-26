const jwt = require('jsonwebtoken')
const fs = require('fs')

const { hashingPassword, comparePassword } = require("../helpers/hashPassword")
const User = require("../models/users")
const dev = require('../config/config')
const { sendEmailWithNodeMailer } = require('../helpers/email')

const signUpUser = async (req, res)=>{
    try{
        const {image} = req.files
        const {name, email, password, birth_year} = req.fields
        if(!name || !email || !password || !birth_year){
            return  res.status(404).json({message: 'Some information is missing'})
        }
        if(password.length < 8){
            return  res.status(400).json({message: 'Your password must have at least 8 characteres'})
        }
        if(birth_year.length !== 4){
            return res.status(400).json({message: 'Please type 4 characters-year'})
        } 
        const yearNow = new Date().getFullYear() 
        if(yearNow - birth_year < 18){
            return  res.status(400).json({message: 'You are too young to join this social media'})
        }
        if(image && image.size > 1000000){
            return  res.status(400).json({message: 'Image size is too big'})
        }
        const alreadyAnUser = await User.findOne({email})
        if(alreadyAnUser){
            return  res.status(400).json({message: 'You already have an account here'})
        }
        const hashedPassword = await hashingPassword(password)

         const token = jwt.sign({ name, email, hashedPassword, image }, dev.jwtKey, {expiresIn: '1h'});

         const emailData = {
             email,
             subject: "Account Activation Email",
             html: `
             <h2> Hello ${name} . </h2>
             <p> Please click <a href="${dev.clientUrl}/user/activate/${token}">here</a> to  activate your account </p>     
             `, // html body
           };
        
         sendEmailWithNodeMailer(emailData)

        res.status(200).json({token, message: 'Please verify your email'})
    }catch(e){
        res.status(500).json({message: e.message})
    }
}

const VerifyEmail = (req, res)=>{
     try {
         const {token} = req.body
         if(!token){
             return res.status(404).json({message: 'Token missing'})
        }
        jwt.verify(token, dev.jwtKey, async function(err, decoded) {
             if(err){
                 return res.status(401).json({message: 'Token expired'})
             }
             const {name, email, hashedPassword, image} = decoded
             const newUser = new User({
                name, email, password: hashedPassword, image
             })
            if(image){ 
                newUser.image.data = fs.readFileSync(image.path);
                newUser.image.contentType = image.type 
            }
            const user = await newUser.save()
            if(!user){
                res.status(400).json({message: 'user was not created'}) 
            }
            res.status(201).json({message: 'e-mail verified. user created'})
        });   
     } catch (e) {
         res.status(500).json({message: e.message})
     }
}

const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            return  res.status(404).json({message: 'Some information is missing'})
        }
        const alreadyAnUser = await User.findOne({email})
        if(!alreadyAnUser){
            return  res.status(400).json({message: 'Sign up first'})
        }
        if(alreadyAnUser.is_banned){
            return  res.status(400).json({message: 'Banned user'})
        }
        const checkPassword = await comparePassword(password, alreadyAnUser.password)
        if(!checkPassword){
            res.status(400).json({message: 'Wrong password'})
        }
        req.session.userId = alreadyAnUser._id
        res.status(200).json({message: 'login ok'}) 
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

const logoutUser = (req, res)=>{
    try {
        req.session.destroy()
        res.clearCookie('user_session')
        res.status(200).json({message: 'logout ok'}) 
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

const profile =async (req, res)=>{
    try {
        const userInfo = await User.findById(req.session.userId, {name:1, email:1, image:1, _id:0})
        res.status(200).json({message: 'profile', userInfo}) 
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

const deleteUser =async (req, res)=>{
    try {
        await User.findByIdAndDelete(req.session.userId)
        res.status(200).json({message: 'profile deleted'}) 
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

const updateUser =async (req, res)=>{
    try {
       const updatedUser =  await User.findByIdAndUpdate(req.session.userId, {name: req.fields.name},{new:true})
    if(!updatedUser){
        res.status(400).json({message: 'Error to update profile'}) 
    }
    if(req.files.image){
        const {image} = req.files
        updatedUser.image.data = fs.readFileSync(image.path);
        updatedUser.image.contentType = image.type 
    }
    await updatedUser.save()
       res.status(200).json({message: 'profile updated'}) 
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

const resetPassword = async (req, res)=>{
    try {
        const {email, password /* it is the new password*/} = req.body
        if(!email || !password){
            return  res.status(404).json({message: 'Some information is missing'})
        }
        if(password.length < 8){
            return  res.status(400).json({message: 'Your password must have at least 8 characteres'})
        }
        const alreadyAnUser = await User.findOne({email})
        if(!alreadyAnUser){
            return  res.status(400).json({message: 'Sign up first'})
        }
      
        const hashedPassword = await hashingPassword(password)

         const token = jwt.sign({  email, hashedPassword }, dev.jwtKey, {expiresIn: '1h'});

         const emailData = {
             email,
             subject: "Update Password",
             html: `
             <h2> Hello ${alreadyAnUser.name} . </h2>
             <p> Please click <a href="${dev.clientUrl}/user/reset-password/${token}">here</a> to  reset your password </p>     
             `, // html body
           };
        
         sendEmailWithNodeMailer(emailData)

        res.status(200).json({token, message: 'Please verify your email to reset your password'})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

const VerifyPassword = (req, res)=>{
    try {
        const {token} = req.body
        if(!token){
            return res.status(404).json({message: 'Token missing'})
       }
       jwt.verify(token, dev.jwtKey, async function(err, decoded) {
            if(err){
                return res.status(401).json({message: 'Token expired'})
            }
        const {email, hashedPassword} = decoded
        const updatedUser = await User.updateOne({email}, {$set:{password: hashedPassword}})
        if(!updatedUser){
            res.status(400).json({message: 'Error to update password'}) 
        }
           res.status(200).json({message: 'password changed ok'})
       });   
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

module.exports = {signUpUser, VerifyEmail, loginUser, logoutUser, profile, deleteUser, updateUser, resetPassword, VerifyPassword}