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

module.exports = {loggedin, loggedout}