const bcrypt = require('bcrypt')

const saltRounds = 8

hashingPassword = async (password)=>{
    try{
        return await bcrypt.hash(password, saltRounds)
    } catch(e){
        console.log(e)
    }
}

module.exports ={ hashingPassword}

