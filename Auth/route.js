// This code sets up an Express.js router for handling various user-related routes and their corresponding functions

const express = require("express")
const router = express.Router()
const { registerUser, loginUser, updateUser, deleteUser } = require("./auth")
const { adminAuth } = require("../middleware/auth")

//  Define several routes and associate them with the corresponding functions 
router.route("/registerUser").post(registerUser) // When a POST request is made to this route, it invokes the registerUser function, which is responsible for user registration.
router.route("/loginUser").post(loginUser);// This route handles user login and calls the loginUser function.

// This route is used for updating user roles. 
// It associates both adminAuth middleware and the updateUser function, meaning that only authenticated admin users can access this route to update user roles.
router.route("/updateUser").put(adminAuth, updateUser)

// Similar to the updateUser route, this route is associated with adminAuth middleware and the deleteUser function,
//  ensuring that only authenticated admin users can delete user accounts.
router.route("/deleteUser").delete(adminAuth, deleteUser)


module.exports = router

