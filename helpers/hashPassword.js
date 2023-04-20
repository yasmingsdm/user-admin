const bcrypt = require('bcrypt')

const saltRounds = 8

const hashingPassword = async (password)=>{
    try{
        return await bcrypt.hash(password, saltRounds)
    } catch(e){
        console.log(e)
    }
}

const comparePassword = async (password, hashedPassword)=>{
    try{
        return await bcrypt.compare(password, hashedPassword)
    } catch(e){
        console.log(e)
    }
}

module.exports ={ hashingPassword, comparePassword}

