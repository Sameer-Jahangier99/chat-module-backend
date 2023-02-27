const router = require("express").Router();

// Controller
const {
  registerUser,
  loginUser,
} = require("../controller/userController");

router.post("/", registerUser);
router.route("/login").post(loginUser);
module.exports = router;
