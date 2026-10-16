const jwt = require("jsonwebtoken")
function generateAccessToken(user_id,user_name){
 return jwt.sign({
    user:{
        id : user_id,
        user_name : user_name
    }
},
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn : "10m"}
)}

const generateRefreshToken = (user_id)=>{
    return jwt.sign({
    user:{
        id : user_id
    }
},
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn : "30d"}
)
}

module.exports = {generateAccessToken,generateRefreshToken};