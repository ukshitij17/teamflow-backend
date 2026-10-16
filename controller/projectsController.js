const asyncHandler = require("express-async-handler");
const Project = require("../models/projectSchema")

const createProject = asyncHandler(async(req,res)=>{
    const {projectName, projectDescription} = req.body;

    if(!projectName){
        res.status(400);
        throw new Error("Project name is missing");
    }
    
    const check_for_duplicate = await Project.findOne({
        user_id : req.user.id,
        projectName : projectName
    });

    if(check_for_duplicate){
        res.status(409);
        throw new Error("A Project with the same name already exists!")
    }

    const createProject = await Project.create({
        projectName,
        projectDescription,
        user_id : req.user.id
    })

    res.status(201).json({"message": "Project Created Successfully"});

})

module.exports = {createProject}