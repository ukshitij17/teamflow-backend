const constants = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    SERVER_ERROR: 500,
};

const errorMessages = {
    400: "Bad Request - The request could not be understood or was missing required parameters.",
    401: "Unauthorized - Authentication is required and has failed or has not been provided.",
    403: "Forbidden - You do not have permission to access this resource.",
    404: "Not Found - The requested resource could not be found.",
    405: "Method Not Allowed - The request method is not supported for this resource.",
    409: "Conflict - The request could not be completed due to a conflict with the current state of the resource.",
    500: "Internal Server Error - Something went wrong on the server.",
};

module.exports = {constants, errorMessages};