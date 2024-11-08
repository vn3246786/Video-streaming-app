const dotenv = require('dotenv').config()
const express = require('express');
const cors = require("cors")
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authRouter = require('./Routes/auth')
const usersRouter = require('./Routes/users')
const moviesRouter = require('./Routes/movies')
const listRouter = require('./Routes/list')
const paymentRouter = require('./Routes/payments')
const paymentsWebhook =require('./Routes/paymentsWebhook')
const cookie =require('cookie-parser')


app.use(cors({origin:[process.env.CLIENT_URL,process.env.ADMIN_URL,process.env.LOCALHOST_URL],
    credentials:true}))

app.use(cookie())

app.use('/api/paymentsWebhook' , paymentsWebhook)
app.use(bodyParser.json())
app.use(express.json())
app.use('/api/auth' , authRouter)
app.use('/api/users' , usersRouter)
app.use('/api/movies' , moviesRouter)
app.use('/api/lists' , listRouter)
app.use('/api/payments' , paymentRouter)



mongoose.connect(process.env.MONGO_URL).then(()=> console.log('mongodb connected')).catch((error)=> console.log(error))

app.listen(process.env.PORT||3000, () => {
    console.log('server running')
})

// This is your test secret API key.


 
