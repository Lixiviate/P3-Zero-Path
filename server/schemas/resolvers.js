const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");
const fs = require('fs');
const path = require('path');

const uploadImage = async (base64Image) => {
  // Remove header from base64 string
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  
  // Create buffer from base64 string
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Generate unique filename
  const filename = `profile-${Date.now()}.png`;
  
  // Define path to save image
  const filePath = path.join(__dirname, '..', 'public', 'images', filename);
  
  // Save image
  await fs.promises.writeFile(filePath, buffer);
  
  // Return URL of saved image
  return `/images/${filename}`;
};

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
      return { 
        token, 
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          goals: user.goals,
          carbonData: user.carbonData
        }
      };
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

      return { 
        token, 
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          goals: user.goals,
          carbonData: user.carbonData
        }
      };
    },

    updateUser: async (parent, { username, email, password, profileImage, goals }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You need to be logged in to update your profile!"
        );
      }
    
      const user = await User.findById(context.user._id);
    
      if (username) user.username = username;
      if (email) user.email = email;
      if (password) user.password = password;
      if (goals) user.goals = goals;
    
      if (profileImage) {
        const imageUrl = await uploadImage(profileImage);
        user.profileImageUrl = imageUrl;
      }
    
      await user.save();
    
      const token = signToken(user);
    
      return {
        success: true,
        message: "User updated successfully",
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          goals: user.goals,
          carbonData: user.carbonData
        },
      };
    },
  },
};

module.exports = resolvers;