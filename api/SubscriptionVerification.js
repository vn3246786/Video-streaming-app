const User = require('./Models/User')


const SubscriptionVerification=(req,res,next)=>{
if(req.user.payment_status===true){
    next()
}else {
    res.json('user is not subscribed')}
}

module.exports =SubscriptionVerification