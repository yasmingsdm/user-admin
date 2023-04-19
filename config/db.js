const mongoose = require('mongoose');
const dev = require('./config');


const connectDB = async ()=>{
try{
    await mongoose.connect(dev.url)
    console.log('Connected!');
}catch(e){
    console.log(e)
}
}

  module.exports = connectDB
