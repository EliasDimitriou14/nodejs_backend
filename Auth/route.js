const express = require("express")
const router = express.Router()
const { registerUser, loginUser, updateUser, deleteUser } = require("./auth")
const { adminAuth } = require("../middleware/auth")

router.route("/registerUser").post(registerUser)
router.route("/loginUser").post(loginUser);
router.route("/updateUser").put(updateUser);
router.route("/deleteUser").delete(deleteUser)

router.route("/update").put(adminAuth, update)
router.route("/deleteUser").delete(adminAuth, deleteUser)

module.exports = router
