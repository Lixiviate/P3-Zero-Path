import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation updateUser($username: String, $email: String, $password: String, $profileImage: String, $goals: [String]) {
    updateUser(username: $username, email: $email, password: $password, profileImage: $profileImage, goals: $goals) {
      success
      message
      user {
        _id
        username
        email
        profileImageUrl
        goals
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
        profileImageUrl
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
        profileImageUrl
      }
    }
  }
`;