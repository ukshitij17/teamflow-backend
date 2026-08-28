const express = require("express")
const router = express.Router() //creates a modular router that allows us to define and organize related routes
const {userRegister , userLogin} = require("../controller/userController")

router.route("/userRegister").post(userRegister)
router.route("/userLogin").post(userLogin)

module.exports = router;