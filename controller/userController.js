const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    if (existingUser && await bcrypt.compare(password,existingUser.password)) {
        const accessToken =  jwt.sign({
            username: existingUser.name,
            email: existingUser.email,
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m" }
        )
        res.status(200).json({"message" : "User Login Successfully", "accessToken" : accessToken})
    }
    else {
        res.status(401);
        throw new Error("Invalid email or password");
    }



})
module.exports = { userRegister, userLogin }