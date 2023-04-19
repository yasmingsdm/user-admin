const express = require ('express')
const dev = require('./config/config')


const app = express()
const port= dev.port

app.get('/', (req,res)=>{
    res.status(200).json({message:'Testing'})
})

app.listen(port, ()=>{
    console.log(`Running at http://localhost:${port}`)
})