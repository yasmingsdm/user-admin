const express = require ('express')
const cookieParser = require('cookie-parser')

const dev = require('./config/config')
const connectDB = require('./config/db')
const userRouter = require('./routes/users')
const adminRouter = require('./routes/admin')


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
const port= dev.port

app.use('/user', userRouter)
app.use('/admin', adminRouter)

app.get('/', (req,res)=>{
    res.status(200).json({message:'Testing'})
})

app.listen(port, async ()=>{
    console.log(`Running at http://localhost:${port}`)
    await connectDB()
})