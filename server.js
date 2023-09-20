// This code:
// 1.Sets up an Express.js server
// 2.Configures middleware for parsing cookies and JSON data
// 3.Defines routes with authentication middleware
// 4.Starts the server
// 5.Handles unhandled promise rejections
// 6.Connects to a MongoDB database.
// The authentication middleware (adminAuth and userAuth) ensures that certain routes are protected and only accessible to users with specific roles.

const express = require("express")
const connectDB = require("./db")
const cookieParser = require("cookie-parser")
const { adminAuth, userAuth } = require("./middleware/auth.js");
require('dotenv').config()

const app = express()
app.use(cookieParser())// middleware is used to parse cookies in incoming requests.
//  This is important because it allows the application to read cookies, including JWT tokens, which are often stored as cookies.

app.use(express.json())
app.use("/api/auth", require("./Auth/route")) // This route is associated with the routes defined in the "./Auth/route" module, which  handles user authentication and registration.
app.get("/admin", adminAuth, (req, res) => res.send("Admin Route")); // This route is protected by the adminAuth middleware, meaning only users with the "admin" role can access it. 
//When accessed, it responds with "Admin Route."

app.get("/basic", userAuth, (req, res) => res.send("User Route")); //This route is protected by the userAuth middleware, allowing only users with the "Basic" role to access it.
// When accessed, it responds with "User Route."

const server = app.listen(process.env.PORT, () =>
 console.log(`Server Connected to port ${process.env.PORT}`)
)

//Handling Error
process.on("unhandledRejection", err => {
    console.log(`An error occured: ${err.message}`)
    server.close(() => process.exit(1))
})

// Connect the Database
connectDB();
