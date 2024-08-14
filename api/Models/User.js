const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    profilePic:{type:String,default:""},
    username : {type : String , unique : true , required : true },
    email : {type : String , unique : true , required : true },
    password : {type : String , required : true },
    isAdmin : {type : Boolean , default : false},
    subscription_details : {type : Object,default:{}},
    payment_status : {type : Boolean,default:false},
    ratings : {type : Object,default:{}},
    recommendations : {type : Array,default:[]},
    watchlist : {type : Array },

},{timestamps : true}
)

module.exports = mongoose.model('user', UserSchema)