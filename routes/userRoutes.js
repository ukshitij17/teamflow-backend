const express = require("express")
const router = express.Router() //creates a modular router that allows us to define and organize related routes
const {userRegister} = require("../controller/userController")

router.route("/userRegister").post(userRegister)

module.exports = router;