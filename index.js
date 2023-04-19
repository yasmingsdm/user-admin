const express = require ('express')
const dev = require('./config/config')
const connectDB = require('./config/db')


const app = express()
const port= dev.port

app.get('/', (req,res)=>{
    res.status(200).json({message:'Testing'})
})

app.listen(port, async ()=>{
    console.log(`Running at http://localhost:${port}`)
    await connectDB()
})