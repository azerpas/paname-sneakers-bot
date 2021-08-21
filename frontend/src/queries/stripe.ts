import gql from 'graphql-tag';

export const CREATE_SESSION = gql`
    mutation createSession(
        $priceId: String!
        $customerId: String
    ) {
        createSession(priceId: $priceId, customerId: $customerId){
            id
        }
    }
`;

export const PAYMENT_INTENT = gql`
    mutation paymentIntent(
        $amount: Float!
        $balance: Boolean!
        $customerId: String!
    ) {
        paymentIntent(amount: $amount, balance: $balance, customerId: $customerId){
            id
        }
    }
`;

export const GET_SESSION = gql`
    query getSession {
        getSession{
            id
        }
    }
`;

export const PAYMENT_LIST = gql`
query paymentIntentList($customerId: String!,$limit: Float!) {
    paymentIntentList(customerId: $customerId, limit: $limit){
        amount,
        type,
        date
    }
  }
`;