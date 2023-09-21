/* 
  Backend logic for user registration, authentication, role management, and user deletion 
  This code is the backend implementation of user registration, login, updating user roles, and deleting users in a Node.js application using: 
    1.Express.js
    2.MongoDB
    3.bcrypt (for password hashing)
    4.JSON Web Tokens (JWT for authentication and authorization).
*/

const User = require("../model/user")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const jwtSecret ="cb9c3dc56e90692d95b2e65e3c3ce9f3ba6203e9a79d353e1c2ca22dee01fe822b12a5"


// This function handles user registration
exports.registerUser = async (req, res, next) => {

    // Expect a POST request with a JSON body containing a username and password.
    const { username, password } = req.body

    // Check if the password length is at least 6 characters. If not ---> Bad Request
    if(password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters" })
    }

    //  Hash the provided password using bcrypt and then create a new user in the database with the hashed password.
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        username,
        password: hash,
      })
       // Generate a JWT token containing user information (user ID, username, and role)
        .then((user) => {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3 hrs in sec
            }
          );
          // Set the JWT  as an HTTP-only cookie.
          res.cookie("jwt", token,   {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3 hrs in ms
          });
          // Send a response with a status of 201  if the user is successfully registered.
          res.status(201).json({
            message: "User successfully created",
            user: user._id,
          });
        })
        .catch((error) =>
          res.status(400).json({
            message: "User not successful created",
            error: error.message,
          })
        );
    });
};


// This function handles user login
exports.loginUser = async (req, res, next) => {

  // Expect a POST request with a JSON body containing a username and password.
  const { username, password } = req.body

  // Check if username amd password are provided
  if( !username || !password ) {
    return res.status(400).json({
      message: "Username or Password not present",
    })
  }

  try {
    // Search DB for a user with the given username
    const user = await User.findOne({ username })
    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      // Comparing given password with hashed password
      bcrypt.compare(password , user.password).then(function(result) {
        // If the password matches 
        if(result) {
          //Generate a JWT token,
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          // Set JWT as an HTTP-only cookie
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          // And send a response with a status of 200 for successful login.
          res.status(200).json({
            message: "Login successful",
            user,
          });
          //Otherwise Bad Request
        } else {
          res.status(400).json({ message: "Login not successful"})
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error:  error.message,
    })
  }
}


// This function handles user update
exports.updateUser = async (req, res, next) => {

  // Expect a PUT request with a JSON body containing a role and id.
  const { role, id } = req.body;

  // First -  Verifying if role and id are present
  if (role && id) {
    // Second - Verifying if the value of role is admin
    if (role === "admin") {
      try {
        const user = await User.findById(id);

        // Third - Verifies the user is not an admin
        if (user.role !== "admin") {
          user.role = role;
          await user.save();
          res.status(201).json({ message: "Update successful", user });
        } else {
          res.status(400).json({ message: "User is already an Admin" });
        }
      } catch (error) {
        res.status(400).json({ message: "An error occurred", error: error.message });
      }
    } else {
      res.status(400).json({ message: "Role is not admin" });
    }
  } else {
    res.status(400).json({ message: "Role or Id not present" });
  }
}


// This function handles user delete
exports.deleteUser = async (req, res, next) => {

  // Expect a DELETE request with a JSON body containing an id.
  const { id } = req.body;
  try {
    // If the user is found, delete the user from the database and send a response with a status of 200 for successful delete
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User successfully deleted", user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};
