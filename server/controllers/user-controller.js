const { User } = require("../models");
const { signToken } = require("../utils/auth");

module.exports = {
  // Get a single user by either their id or their username
  async getSingleUser({ user = null, params }, res) {
    const foundUser = await User.findOne({
      $or: [
        { _id: user ? user._id : params.id },
        { username: params.username },
      ],
    });

    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Cannot find a user with this id!" });
    }

    res.json(foundUser);
  },

  // Create a user, sign a token, and send it back
  async createUser({ body }, res) {
    const user = await User.create(body);

    if (!user) {
      return res.status(400).json({ message: "Something is wrong!" });
    }

    const token = signToken(user);
    res.json({ token, user });
  },

  // Login a user, sign a token, and send it back
  // Check login input as either email or username
  async login({ body }, res) {
    // Check if login input is an email or username
    const loginInput = body.login.includes("@")
      ? { email: body.login }
      : { username: body.login };

    const user = await User.findOne(loginInput);

    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    const token = signToken(user);
    res.json({ token, user });
  },
};
