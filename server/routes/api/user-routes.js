const router = require("express").Router();
const {
  createUser,
  login,
  getSingleUser,
} = require("../../controllers/user-controller");
const { authMiddleware } = require("../../utils/auth");

// Routes for user signup and login
router.route("/").post(createUser);
router.route("/login").post(login);
router.route("/me").get(authMiddleware, getSingleUser);

module.exports = router;
