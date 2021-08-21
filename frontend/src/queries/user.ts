import gql from 'graphql-tag';

export const GET_ME = gql`
  query GetMe {
    me {
      uid
      email
      roles
      displayName
    }
  }
`;

export const SET_SETTINGS = gql`
  mutation SetSettings(
    $webhook: String!
    $errorWebhook: String!
  ){
    settings(webhook: $webhook, errorWebhook: $errorWebhook){
      webhook, errorWebhook
    }
  }
`;