const asyncHandler = require("express-async-handler");
const Project = require("../models/projectSchema");
const { default: mongoose } = require("mongoose");
const { ReturnDocument } = require("mongodb");

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
    if (!mongoose.isValidObjectId(projectId)) {
        res.status(400);
        throw new Error("Please Enter a Valid ID")
    }
    const getProjectById = await Project.findById(projectId);
    if (!getProjectById) {
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

// DESC : UPDATE PROJECT DETAILS.
// ROUTE : PUT /api/projects/updateProject/:id
// ACCESS : PRIVATE

const updateProject = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    if (!mongoose.isValidObjectId(projectId)) {
        res.status(400);
        throw new Error("Please Enter a Valid ID")
    }

    const getProject = await Project.findById(projectId);

    // req.params.id identifies the project to update.

    // req.body supplies the fields to update.

    // { new: true } tells Mongoose to return the updated document, rather than the document as it was before the update.

    if (!getProject) {
        res.status(404);
        throw new Error("Project does not exists!");
    }
    if (req.user.id !== getProject.user_id.toString()) {
        res.status(403);
        throw new Error("You are not allowed to fetch this Project!");
    }

    //allowlisting
    const updateField = {};
    if (Object.hasOwn(req.body, "projectName")) {
        // Object.hasOwn() checks whether a field exists, not whether its value is valid.
        if (typeof req.body.projectName !== "string" || req.body.projectName.trim() === "") {
            res.status(400);
            throw new Error("Project Name can't be empty")
        }
        updateField.projectName = req.body.projectName.trim();
    }

    if (Object.hasOwn(req.body, "projectDescription")) {

        updateField.projectDescription = req.body.projectDescription.trim();

    }

    if (Object.keys(updateField).length === 0) {
        res.status(400);
        throw new Error("Please Provide atleast one field to update");
    }



    const getProjectupdated = await Project.findByIdAndUpdate(projectId, updateField, { ReturnDocument: "after" });

    res.status(200).json({ "message": "Updated successfully!", getProjectupdated })
}
)

const deleteProject = asyncHandler(async (req, res) => {
    const projectID = req.params.id;
    if(!mongoose.isValidObjectId(projectID)){
        res.status(400);
        throw new Error("Please Enter a Valid Id")
    }
    const projectToBeDeleted = await Project.findById(projectID);
    if (!projectToBeDeleted) {
        res.status(404);
        throw new Error("Project does not exists!")
    }

    if (req.user.id !== projectToBeDeleted.user_id.toString()) {
        res.status(403);
        throw new Error("You are not allowed to delete this Project!");
    }

    await projectToBeDeleted.deleteOne();
    res.status(200).json({ "message": "Project Deleted Successfully!" })

})

module.exports = { createProject, getProject, getProjectById, updateProject,deleteProject }