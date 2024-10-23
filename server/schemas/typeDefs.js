const typeDefs = `
  type Query {
    me: User
  }

  type Mutation {
    login(login: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(
      username: String
      email: String
      password: String
      profilePhoto: String
      goals: [String]
      accomplishedGoals: [AccomplishedGoalInput]
    ): UserUpdateResponse
    verifyCredentials(email: String!, password: String!): Boolean!
  }

  type User {
    _id: ID
    username: String!
    email: String!
    profilePhoto: String
    goals: [String]
    accomplishedGoals: [AccomplishedGoal]
  }

  type AccomplishedGoal {
    goal: String!
    accomplishedAt: String!
  }

  input AccomplishedGoalInput {
    goal: String!
    accomplishedAt: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type UserUpdateResponse {
    success: Boolean!
    message: String
    user: User
    token: String
  }
`;

module.exports = typeDefs;