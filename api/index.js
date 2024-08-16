const dotenv = require('dotenv').config()
const express = require('express');
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authRouter = require('./Routes/auth')
const usersRouter = require('./Routes/users')
const moviesRouter = require('./Routes/movies')
const listRouter = require('./Routes/list')
const paymentRouter = require('./Routes/payments')
const paymentsWebhook =require('./Routes/paymentsWebhook')
const cors = require('cors')
const cookie =require('cookie-parser')



const whitelist = ["https://video-streaming-app-4zki.onrender.com"]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1|| !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  Credentials:true,
  allowedHeaders:"x-token"
}

app.use(cors(corsOptions))
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

app.listen(process.env.PORT, () => {console.log('server running')})

// This is your test secret API key.


 
