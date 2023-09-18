const User = require("../model/user")
const bcrypt = require("bcryptjs")

exports.register = async (req, res, next) => {
    const { username, password } = req.body
    if(password.length < 6) {
        return res.status(400).json({ message: "Password less tha 6 characters" })
    }
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        username,
        password: hash,
      })
        .then((user) =>
          res.status(200).json({
            message: "User successfully created",
             user,
          })
        )
        .catch((error) =>
          res.status(400).json({
            message: "User not successful created",
            error: error.message,
          })
        );
    });
}

exports.login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username, password })
      if (!user) {
        res.status(401).json({
          message: "Login not successful",
          error: "User not found",
        })
      } else {
        res.status(200).json({
          message: "Login successful",
          user,
        })
      }
    } catch (error) {
      res.status(400).json({
        message: "An error occurred",
        error: error.message,
      })
    }
}

exports.update = async (req, res, next) => {
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
