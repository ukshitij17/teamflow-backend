const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser")
const app = express();
const connectDB = require("./config/connectionDB")
connectDB()
// express() is a function, and calling it creates an Express application instance, which we conventionally store in app.
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(cookieParser())
app.use("/api/user",require("./routes/userRoutes"))
app.use(errorHandler)


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
// app.listen() starts the HTTP server and makes it listen on the specified port. Once the server successfully starts listening, the callback function is executed.

