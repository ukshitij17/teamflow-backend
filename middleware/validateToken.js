const jwt = require("jsonwebtoken")
const validateToken = (req, res, next)=>{
    let token;
    const authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer ")){
        token = authHeader.split(" ")[1];
        if(!token){
            res.status(401);
            throw new Error("Unauthorized"); //if the req is like : Bearer 
        }
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err, decode)=>{
            if(err){
                res.status(401);
                throw new Error("Unauthorized");
            }
            req.user = decode.user;
            next();
        })
    }
    else{
        res.status(401);
        throw new Error("Unauthorized");
    }
}
module.exports = validateToken;