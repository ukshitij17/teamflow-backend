const express = require("express")
const router = express.Router() //creates a modular router that allows us to define and organize related routes
const {userRegister , userLogin, currentUser, refreshToken} = require("../controller/userController")
const validateToken = require("../middleware/validateToken")

router.route("/userRegister").post(userRegister);
router.route("/userLogin").post(userLogin);
router.route("/currentUser").get(validateToken, currentUser);
router.route("/refreshtoken").post(refreshToken);

module.exports = router;