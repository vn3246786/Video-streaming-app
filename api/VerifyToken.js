const jwt = require('jsonwebtoken')

const verify = (req , res , next) => {
    const authToken = req.headers.token
    if(authToken){
        const token = authToken.split(" ")[1]
jwt.verify(token ,process.env.JWT_ACCESSTOKEN_KEY, (err , user) => {
    if(err){
        res.json("invalid token") 
  
    }else{
        req.user = user
        next()
    }
})
    }else{
        res.json("accesstoken not found")
    }

}

module.exports = verify