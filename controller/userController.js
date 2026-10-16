const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokens");

//DESC Register a new user
//ROUTE POST /api/user/userRegister
//ACCESS public

const userRegister = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Enter all the required fields.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(409);
        throw new Error("User already exist.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
        name,
        password: hashedPassword,
        email

    })

    res.status(201).json({ "message": "User Registered Successfully!", "name": name, "email": email });
}
)

//DESC User Login
//ROUTE POST /api/user/userLogin
//ACCESS public


const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory.")
    }
    const existingUser = await User.findOne({ email });
    // if(!existingUser){
    //     res.status(401);
    //     throw new Error("Invalid email or password");
    // }

    if (existingUser && await bcrypt.compare(password, existingUser.password)) {


        const accessToken = generateAccessToken(existingUser.id, existingUser.name);

        const refreshToken = generateRefreshToken(existingUser.id);
        res.cookie("refreshToken",refreshToken,{
            httpOnly : true,
            sameSite: "strict"
        })
        existingUser.refreshToken = refreshToken;
        await existingUser.save();
        res.status(200).json({ "message": "User Login Successfully", "accessToken": accessToken})
    }
    else {
        res.status(401);
        throw new Error("Invalid email or password");
    }



})

const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json({ "Here is the User's id": req.user.id, "Username": req.user.user_name });
})

//DESC Verify RefreshToken
//ROUTE POST /api/user/refresh
//ACCESS public

const refreshToken = asyncHandler(async (req, res) => {
    
    const token = req.cookies.refreshToken;

    if (token) {
        
        try {
            const decodedPayload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            const existingUser = await User.findById(decodedPayload.user.id);
            //Check against the database
            if (existingUser.refreshToken !== token) {
                res.status(400);
                throw new Error("Unauthorized User");
            }

            const newAccessToken = generateAccessToken(decodedPayload.user.id);

            const newRefreshToken = generateRefreshToken(decodedPayload.user.id);

            existingUser.refreshToken = newRefreshToken;

            await existingUser.save();

            res.cookie("refreshToken",newRefreshToken,{
                httpOnly: true,
                sameSite : "strict"
            })
            res.status(200).json({ "newAccessToken": newAccessToken})

        } catch (error) {
            res.status(401);
            throw new Error("Unauthorized");
        }

    }
    else {
        res.status(401);
        throw new Error("Unauthorized");
    }
})

module.exports = { userRegister, userLogin, currentUser, refreshToken };