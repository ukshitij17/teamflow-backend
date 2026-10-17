const asyncHandler = require("express-async-handler");
const Project = require("../models/projectSchema");
const { default: mongoose } = require("mongoose");

// DESC : CREATE PROJECTS
// ROUTE : POST /api/projects/createProject
// ACCESS : PRIVATE
const createProject = asyncHandler(async (req, res) => {
    const { projectName, projectDescription } = req.body;

    if (!projectName) {
        res.status(400);
        throw new Error("Project name is missing");
    }

    const check_for_duplicate = await Project.findOne({
        user_id: req.user.id,
        projectName: projectName
    });

    if (check_for_duplicate) {
        res.status(409);
        throw new Error("A Project with the same name already exists!")
    }

    const createProject = await Project.create({
        projectName,
        projectDescription,
        user_id: req.user.id
    })

    res.status(201).json({ "message": "Project Created Successfully" });

})

// DESC : GET ALL THE PROJECTS OF A USER.
// ROUTE : GET /api/projects/getProjects
// ACCESS : PRIVATE

const getProject = asyncHandler(async (req, res) => {
    const getProject = await Project.find({ user_id: req.user.id });

    res.status(200).json({ "message": "Projects fetched successfully!", getProject })
}
)
// DESC : GET PROJECT BY ID.
// ROUTE : GET /api/projects/getProjectById/:id
// ACCESS : PRIVATE

const getProjectById = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    if(!mongoose.isValidObjectId(projectId)){
        res.status(400);
        throw new Error("Please Enter a Valid ID")
    }
    const getProjectById = await Project.findById(projectId);
    if(!getProjectById){
        res.status(404);
        throw new Error("Project does not exists!");
    }
    if (req.user.id !== getProjectById.user_id.toString()) {
        res.status(404);
        throw new Error("You are not allowed to fetch this Project!");
    }


    res.status(200).json({ "message": "Project fetched successfully!", getProjectById })
}
)

module.exports = { createProject, getProject, getProjectById }