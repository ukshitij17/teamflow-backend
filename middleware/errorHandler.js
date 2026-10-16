const {constants,errorMessages} = require("../constants")
const errorHandler = (err,req, res, next)=>{
    //Handling mongoDB duplicate key error.
    if(err.code == 11000){
        res.status(409);
        res.json({"message": "A Project with the same name already exists", "stackTrace": err.stack});
        return;
    }
    
    const statusCode = res.statusCode && res.statusCode != 200 ? res.statusCode : 500;
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({"message":errorMessages[400], "stackTrace" : err.stack})
            break;
        case constants.UNAUTHORIZED:
            res.json({"message":errorMessages[401], "stackTrace" : err.stack})
            break;
        case constants.FORBIDDEN:
            res.json({"message":errorMessages[403], "stackTrace" : err.stack})
            break;
        case constants.NOT_FOUND:
            res.json({"message":errorMessages[404], "stackTrace" : err.stack})
            break;
        case constants.METHOD_NOT_ALLOWED:
            res.json({"message":errorMessages[405], "stackTrace" : err.stack})
            break;
        case constants.CONFLICT:
            res.json({"message":errorMessages[409], "stackTrace" : err.stack})
            break;
        case constants.SERVER_ERROR:
            res.json({"message":errorMessages[500], "stackTrace" : err.stack})
            break;
    
        default:
            res.status(statusCode).json({
                "message" : err.message,
                "stackTrace": err.stack
            })
            break;
    }
}
module.exports = errorHandler