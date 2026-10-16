const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    projectName : {
        type : String,
        required : [true]
    },
    projectDescription : {
        type : String
    }
    
});
//A user cannot have two projects with the same name.(compound unique index)
projectSchema.index(
    {user_id : 1, projectName : 1},
    {unique : true}
);

module.exports = mongoose.model("Project",projectSchema)