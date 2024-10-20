const typeDefs = `
  type Query {
    me: User
  }

  type Mutation {
    login(login: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String, profilePhoto: String): UserUpdateResponse
    verifyCredentials(email: String!, password: String!): Boolean!
  }

  type User {
    _id: ID
    username: String!
    email: String!
    profilePhoto: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type UserUpdateResponse {
    success: Boolean!
    message: String
    user: User
    token: ID
  }
`;

module.exports = typeDefs;