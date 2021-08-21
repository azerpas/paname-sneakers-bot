import gql from 'graphql-tag';

export const SIGN_UP = gql`
  mutation SignUp(
    $recaptcha: String!
    $email: String!
    $password: String!
    $key: String!
    $alias: String!
  ) {
    SignUp(recaptcha: $recaptcha, email: $email, password: $password, key: $key, alias: $alias){
      token, accessToken
    }
  }
`;

export const SIGN_UP_BASIC = gql`
  mutation SignUpBasic(
    $recaptcha: String!
    $email: String!
    $password: String!
    $alias: String!
  ) {
    SignUpBasic(recaptcha: $recaptcha, email: $email, password: $password, alias: $alias){
      token, accessToken
    }
  }
`;

export const LOGIN = gql`
  mutation LogIn(
    $email: String!
    $password: String!
    $recaptcha: String!
  ) {
    LogIn(email: $email, password: $password, recaptcha: $recaptcha){
      token, accessToken
    }
  }
`;

export const KEY_VALID = gql`
  query KeyValid($uuid: String!) {
    KeyValid(uuid: $uuid){
      type
      uuid
    }
  }
`;