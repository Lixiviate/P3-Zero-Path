const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const bcrypt = require("bcrypt");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    login: async (parent, { login, password }) => {
      // Check if the input is an email or username
      const loginInput = login.includes("@")
        ? { email: login }
        : { username: login };

      const user = await User.findOne(loginInput);

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      // Check if username or email is already in use
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        throw new AuthenticationError(
          "Username or Email already exists. Please try again."
        );
      }

      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    updateUser: async (parent, { username, email, password }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      // Check if the new username or email is already in use by another user
      if (username || email) {
        const existingUser = await User.findOne({
          $or: [{ username }, { email }],
          _id: { $ne: context.user._id },
        });

        if (existingUser) {
          return {
            success: false,
            message: "Username or Email is already in use.",
            user: null,
          };
        }
      }

      // Update user data
      const updatedUser = await User.findById(context.user._id);

      if (username) updatedUser.username = username;
      if (email) updatedUser.email = email;
      if (password) {
        const saltRounds = 10;
        updatedUser.password = await bcrypt.hash(password, saltRounds);
      }

      await updatedUser.save();

      return {
        success: true,
        message: "User profile updated successfully",
        user: updatedUser,
      };
    },
  },
};

module.exports = resolvers;
