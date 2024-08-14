


export function findError(response){

    return (
      response==="server error"||
      response==="no recommendations"||
      response==="accesstoken not found"||
      response==="invalid token"||
      response==="you are not authorized"||
      response==="user is not subscribed"||
      response==="username or password is incorrect"||
      response==="Wrong otp"||
    response==="unauthorized access denied"||
    response==='password is incorrect'||
    response==='username already exists'||
    response==='email already exists'
    )
  }

