const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
   email:{type:String,unique:true},
createdAt: { type: Date, expires: '5m', default: Date.now }
}
)

module.exports = mongoose.model('Session', sessionSchema)