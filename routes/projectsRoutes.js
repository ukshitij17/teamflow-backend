const express = require("express");
const validateToken = require("../middleware/validateToken");
const router = express.Router();
const {createProject,getProject,getProjectById} = require("../controller/projectsController")
router.use(validateToken);

router.route("/createProject").post(createProject);
router.route("/getProjects").get(getProject);
router.route("/getProjectById/:id").get(getProjectById);
module.exports = router;