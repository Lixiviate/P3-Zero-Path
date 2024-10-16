const typeDefs = `
  type User {
    _id: ID
    username: String!
    email: String!
    profileImageUrl: String
    goals: [String]
    carbonData: CarbonData
  }

  type CarbonData {
    carbon_kg: Float
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(login: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String, profileImage: String, goals: [String]): UserUpdateResponse
  }

  type UserUpdateResponse {
    success: Boolean!
    message: String
    token: String
    user: User
  }
`;

module.exports = typeDefs;