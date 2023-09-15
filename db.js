const Mongoose = require("mongoose")
require('dotenv').config()

const connectDB = async () => {
    await Mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log("MongoDB Connected")
}
module.exports = connectDB
