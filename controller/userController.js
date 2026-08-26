const asyncHandler = require("express-async-handler")
const User = require("../models/userSchema")
const bcrypt = require("bcrypt")
const userRegister = asyncHandler(async(req,res)=>{
    const {name, email, password} = req.body;
    
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Enter all the required fields.");
    }

    const existingUser =await User.findOne({email});
    if(existingUser){
        res.status(409);
        throw new Error("User already exist.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
        name,
        password : hashedPassword,
        email

    })

    res.status(201).json({"message": "User Registered Successfully!", "name" : name, "email" : email});
}
)
module.exports = {userRegister}