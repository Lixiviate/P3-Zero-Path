const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findById(context.user._id).select(
          "-__v -password"
        );
        return userData;
      }
      throw new AuthenticationError("Not logged in");
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

      // Verify the password using the isCorrectPassword method from user model
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      // Check if username or email is already in use
      const existingUserByUsername = await User.findOne({ username });
      if (existingUserByUsername) {
        throw new Error("Username already in use");
      }

      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) {
        throw new Error("Email already in use");
      }

      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },

    updateUser: async (
      parent,
      { username, email, password, profilePhoto },
      context
    ) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You need to be logged in to update your profile!"
        );
      }

      // Fetch the currently logged-in user
      const user = await User.findById(context.user._id);

      // Check and update username if provided
      if (username && username !== user.username) {
        const existingUsername = await User.findOne({ username });
        if (
          existingUsername &&
          existingUsername._id.toString() !== user._id.toString()
        ) {
          throw new Error("Username already in use");
        }
        user.username = username;
      }

      // Check and update email if provided
      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email });
        if (
          existingEmail &&
          existingEmail._id.toString() !== user._id.toString()
        ) {
          throw new Error("Email already in use");
        }
        user.email = email;
      }

      // Update password if provided (the password will be hashed by the pre-save hook)
      if (password) {
        user.password = password;
      }

      // Update profilePhoto if provided
      if (profilePhoto) {
        user.profilePhoto = profilePhoto;
      }

      // Save the updated user
      await user.save();

      // Generate a new token after successful update
      const token = signToken(user);

      return {
        success: true,
        token,
        user,
      };
    },
    // Requires a password to update credentials
    verifyCredentials: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        return false;
      }
      const correctPw = await user.isCorrectPassword(password);
      return correctPw;
    },
  },
};

module.exports = resolvers;