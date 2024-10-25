const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

// Load environment variables if not already done
require("dotenv").config();

// Set token secret and expiration date
const secret = process.env.JWT_SECRET;
const expiration = "2h";

module.exports = {
  // function for our authenticated routes
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  authMiddleware: function ({ req }) {
    // Allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Extract token from "Bearer <tokenvalue>"
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    // Verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.error("Invalid token", err);
      req.user = null;
    }

    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
