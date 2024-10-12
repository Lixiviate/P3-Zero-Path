const { User } = require("../models");
const { signToken } = require("../utils/auth");

module.exports = {
  // Get the currently logged-in user
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

  // Create a new user (sign up)
  async createUser({ body }, res) {
    const user = await User.create(body);

    if (!user) {
      return res.status(400).json({ message: "Something is wrong!" });
    }

    const token = signToken(user);
    res.json({ token, user });
  },

  // Login user
  async login({ body }, res) {
    const user = await User.findOne({ email: body.email });

    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    const token = signToken(user);
    res.json({ token, user });
  },
};
