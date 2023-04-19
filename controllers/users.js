const jwt = require('jsonwebtoken')

const { hashingPassword } = require("../helpers/hashPassword")
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

        res.status(201).json({token, message: 'Please verify your email'})
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
        jwt.verify(token, dev.jwtKey, function(err, decoded) {
            if(err){
                return res.status(401).json({message: 'Token expired'})
            }
            const {name, email, hashedPassword, image} = decoded
          });
        res.status(200).json({message: 'e-mail verified'})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

module.exports = {signUpUser, VerifyEmail}