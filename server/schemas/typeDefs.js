const typeDefs = `
  type Query {
    me: User
  }

  type Mutation {
    login(login: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String, profilePhoto: String, carbonData: CarbonDataInput): UpdateUserResponse
  }

  type User {
    _id: ID
    username: String!
    email: String!
    profilePhoto: String
    carbonData: CarbonData
  }

  type CarbonData {
    carbon_kg: Float
  }

  type UpdateUserResponse {
    success: Boolean!
    message: String
    user: User
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

  input CarbonDataInput {
    carbon_kg: Float
  }
`;

module.exports = typeDefs;
