const mongoose = require('mongoose')

const PlanSchema = new mongoose.Schema({
    name : {type : String , unique : true , required : true },
    discription:{type : String , required : true },
    image:{type:String,required:true},
    price:{type:Number},
    quantity:{type:Number},
    currency:{type:String},
    interval:{type:String},
    priceId:{type:String},
},{timestamps : true}
)

module.exports = mongoose.model('plan', PlanSchema)