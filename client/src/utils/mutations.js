import { gql } from "@apollo/client";

// Mutation to update a user's information
export const UPDATE_USER = gql`
  mutation updateUser($username: String, $email: String, $password: String) {
    updateUser(username: $username, email: $email, password: $password) {
      success
      message
      user {
        _id
        username
        email
      }
    }
  }
`;

// Login mutation accepts either a username or email via the `login` field
export const LOGIN_USER = gql`
  mutation login($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation to create a new user (signup)
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
