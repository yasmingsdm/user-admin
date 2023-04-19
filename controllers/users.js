const User = require("../models/users")

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
        res.status(201).json({message: 'Please verify your email'})
    }catch(e){
        res.status(500).json({message: e.message})
    }
}

module.exports = {signUpUser}