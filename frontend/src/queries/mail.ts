import gql from 'graphql-tag';

export const SIGN_UP = gql`
  mutation SignUpMail(
    $recaptcha: String!
    $email: String!
    $firstName: String!
    $lastName: String!
  ) {
    SignUpMail(recaptcha: $recaptcha, email: $email, firstName: $firstName, lastName: $lastName){
      id
    }
  }
`;