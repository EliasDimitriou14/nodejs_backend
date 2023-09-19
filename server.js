const express = require("express")
const connectDB = require("./db")
const cookieParser = require("cookie-parser")
const { adminAuth, userAuth } = require("./middleware/auth.js");
require('dotenv').config()

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use("/api/auth", require("./Auth/route"))
app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));

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
