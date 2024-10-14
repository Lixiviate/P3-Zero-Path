const typeDefs = `
  type Query {
    me: User
  }

  type Mutation {
    login(login: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String): UserUpdateResponse
  }

  type User {
    _id: ID
    username: String!
    email: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type UserUpdateResponse {
    success: Boolean!
    message: String
    user: User
  }
`;

module.exports = typeDefs;
