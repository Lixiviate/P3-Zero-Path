import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation updateUser(
    $username: String
    $email: String
    $password: String
    $profilePhoto: String
    $goals: [String]
    $accomplishedGoals: [AccomplishedGoalInput]
  ) {
    updateUser(
      username: $username
      email: $email
      password: $password
      profilePhoto: $profilePhoto
      goals: $goals
      accomplishedGoals: $accomplishedGoals
    ) {
      success
      message
      user {
        _id
        username
        email
        profilePhoto
        goals
        accomplishedGoals {
          goal
          accomplishedAt
        }
      }
      token
    }
  }
`;

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

export const VERIFY_CREDENTIALS = gql`
  mutation verifyCredentials($email: String!, $password: String!) {
    verifyCredentials(email: $email, password: $password)
  }
`;