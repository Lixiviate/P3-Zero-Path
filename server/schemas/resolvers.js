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

    verifyCredentials: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        return false;
      }

      const correctPw = await user.isCorrectPassword(password);
      return correctPw;
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
      { username, email, password, profilePhoto, goals, accomplishedGoals },
      context
    ) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You need to be logged in to update your profile!"
        );
      }

      const user = await User.findById(context.user._id);

      // Update fields as before
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

      if (password) {
        user.password = password;
      }

      if (profilePhoto) {
        user.profilePhoto = profilePhoto;
      }

      // Update goals if provided
      if (goals !== undefined) {
        user.goals = goals;
      }

      // Update accomplishedGoals if provided
      if (accomplishedGoals !== undefined) {
        user.accomplishedGoals = accomplishedGoals;
      }

      // Save the updated user
      await user.save();

      const token = signToken(user);

      return {
        success: true,
        message: "Profile updated successfully",
        token,
        user,
      };
    },
  },
};

module.exports = resolvers;
