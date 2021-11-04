const {sign, verify } = require("jsonwebtoken")

const createTokens = (user)=>{
    const accessToken = sign({username:user.username, id:user._id},"capitalmoviessecret");
    return accessToken
}

const validateToken = (req, res, next)=>{
  const accessToken = req.body.token
    if(!accessToken)
      return res.status(400).json({error:"User not Authenticated!"});
    try{
        const validateToken = verify(accessToken, "capitalmoviessecret")
        if(validateToken){
            req.authenticated = true
            return next()
        }
    }catch(err){
        return res.status(400).json({error:err})
    }

}

module.exports = {createTokens, validateToken}