// This code defines a MongoDB schema for user data using Mongoose

const Mongoose = require("mongoose")

//  This schema defines the structure of user documents that will be stored in the MongoDB collection associated with this schema.
const UserSchema = new Mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    role: {
        type: String,
        default: "Basic",
        required: true,
    }
})

const User = Mongoose.model("user", UserSchema)
module.exports = User
