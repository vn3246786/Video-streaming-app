const mongoose = require('mongoose')

const OTPSchema = new mongoose.Schema({
   email:{type:String,unique:true},
OTP:{type:Number},
createdAt: { type: Date, expires: '3m', default: Date.now }
}
)

module.exports = mongoose.model('OTP', OTPSchema)