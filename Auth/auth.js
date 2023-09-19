const User = require("../model/user")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const jwtSecret ="cb9c3dc56e90692d95b2e65e3c3ce9f3ba6203e9a79d353e1c2ca22dee01fe822b12a5"

exports.registerUser = async (req, res, next) => {
    const { username, password } = req.body
    if(password.length < 6) {
        return res.status(400).json({ message: "Password less tha 6 characters" })
    }
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        username,
        password: hash,
      })
        .then((user) => {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3 hrs in sec
            }
          );
          res.cookie("jwt", token,   {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3 hrs in ms
          });
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

exports.loginUser = async (req, res, next) => {
  const { username, password } = req.body
  // Check if username amd password are provided
  if( !username || !password ) {
    return res.status(400).json({
      message: "Username or Password not present",
    })
  }
  try {
    const user = await User.findOne({ username })
    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      // Comparing given password with hashed password
      bcrypt.compare(password , user.password).then(function(result) {
        if(result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(200).json({
            message: "Login successful",
            user,
          });
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

exports.updateUser = async (req, res, next) => {
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

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;
  try {
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
