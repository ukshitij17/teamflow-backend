const express = require("express");
const validateToken = require("../middleware/validateToken");
const router = express.Router();
const {createProject} = require("../controller/projectsController")
router.use(validateToken);

router.route("/createProject").post(createProject);

module.exports = router;