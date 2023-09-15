const express = require("express")
const connectDB = require("./db")
require('dotenv').config()

const app = express()
app.use(express.json())
app.use("/api/auth", require("./Auth/route"))


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
