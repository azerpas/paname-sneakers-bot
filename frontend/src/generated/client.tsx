/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  KeyValid: SessionKey;
  me: User;
  getSession: Session;
  paymentIntentList: Array<Transaction>;
};


export type QueryKeyValidArgs = {
  uuid: Scalars['String'];
};


export type QueryPaymentIntentListArgs = {
  limit: Scalars['Float'];
  customerId: Scalars['String'];
};

export type SessionKey = {
  __typename?: 'SessionKey';
  uuid: Scalars['String'];
  type: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  uid: Scalars['String'];
  email: Scalars['String'];
  roles: Array<Scalars['String']>;
  displayName: Scalars['String'];
};

export type Session = {
  __typename?: 'Session';
  id: Scalars['String'];
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Float'];
  type: Scalars['String'];
  date: Scalars['DateTime'];
};


export type Mutation = {
  __typename?: 'Mutation';
  SignUp: SessionToken;
  LogIn: SessionToken;
  SignUpBasic: SessionToken;
  settings: Settings;
  CreateTasks: TaskResponse;
  createSession: Session;
  paymentIntent: Session;
  SignUpMail: MailSession;
};


export type MutationSignUpArgs = {
  alias: Scalars['String'];
  key: Scalars['String'];
  recaptcha: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationLogInArgs = {
  recaptcha: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationSignUpBasicArgs = {
  alias: Scalars['String'];
  recaptcha: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationSettingsArgs = {
  errorWebhook: Scalars['String'];
  webhook: Scalars['String'];
};


export type MutationCreateTasksArgs = {
  raffle: Scalars['ID'];
  tasks: Array<TaskInfos>;
  website: Scalars['ID'];
};


export type MutationCreateSessionArgs = {
  customerId?: Maybe<Scalars['String']>;
  priceId: Scalars['String'];
};


export type MutationPaymentIntentArgs = {
  customerId: Scalars['String'];
  balance: Scalars['Boolean'];
  amount: Scalars['Float'];
};


export type MutationSignUpMailArgs = {
  lastName: Scalars['String'];
  firstName: Scalars['String'];
  email: Scalars['String'];
  recaptcha: Scalars['String'];
};

export type SessionToken = {
  __typename?: 'SessionToken';
  token: Scalars['String'];
  accessToken: Scalars['String'];
};

export type Settings = {
  __typename?: 'Settings';
  webhook: Scalars['String'];
  errorWebhook: Scalars['String'];
};

export type TaskResponse = {
  __typename?: 'TaskResponse';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
};

export type TaskInfos = {
  size: Scalars['String'];
  email: Scalars['String'];
  fname: Scalars['String'];
  lname: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  housenumber?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  utils?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  faking?: Maybe<Scalars['String']>;
  paypal?: Maybe<Scalars['String']>;
  birthdate?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type MailSession = {
  __typename?: 'MailSession';
  id: Scalars['String'];
};

export type CreateTaskMutationVariables = Exact<{
  website: Scalars['ID'];
  tasks: Array<TaskInfos> | TaskInfos;
  raffle: Scalars['ID'];
}>;


export type CreateTaskMutation = (
  { __typename?: 'Mutation' }
  & { CreateTasks: (
    { __typename?: 'TaskResponse' }
    & Pick<TaskResponse, 'success' | 'error' | 'code'>
  ) }
);

export type SignUpMailMutationVariables = Exact<{
  recaptcha: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
}>;


export type SignUpMailMutation = (
  { __typename?: 'Mutation' }
  & { SignUpMail: (
    { __typename?: 'MailSession' }
    & Pick<MailSession, 'id'>
  ) }
);

export type SignUpMutationVariables = Exact<{
  recaptcha: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  key: Scalars['String'];
  alias: Scalars['String'];
}>;


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & { SignUp: (
    { __typename?: 'SessionToken' }
    & Pick<SessionToken, 'token' | 'accessToken'>
  ) }
);

export type SignUpBasicMutationVariables = Exact<{
  recaptcha: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  alias: Scalars['String'];
}>;


export type SignUpBasicMutation = (
  { __typename?: 'Mutation' }
  & { SignUpBasic: (
    { __typename?: 'SessionToken' }
    & Pick<SessionToken, 'token' | 'accessToken'>
  ) }
);

export type LogInMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  recaptcha: Scalars['String'];
}>;


export type LogInMutation = (
  { __typename?: 'Mutation' }
  & { LogIn: (
    { __typename?: 'SessionToken' }
    & Pick<SessionToken, 'token' | 'accessToken'>
  ) }
);

export type KeyValidQueryVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type KeyValidQuery = (
  { __typename?: 'Query' }
  & { KeyValid: (
    { __typename?: 'SessionKey' }
    & Pick<SessionKey, 'type' | 'uuid'>
  ) }
);

export type CreateSessionMutationVariables = Exact<{
  priceId: Scalars['String'];
  customerId?: Maybe<Scalars['String']>;
}>;


export type CreateSessionMutation = (
  { __typename?: 'Mutation' }
  & { createSession: (
    { __typename?: 'Session' }
    & Pick<Session, 'id'>
  ) }
);

export type PaymentIntentMutationVariables = Exact<{
  amount: Scalars['Float'];
  balance: Scalars['Boolean'];
  customerId: Scalars['String'];
}>;


export type PaymentIntentMutation = (
  { __typename?: 'Mutation' }
  & { paymentIntent: (
    { __typename?: 'Session' }
    & Pick<Session, 'id'>
  ) }
);

export type GetSessionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSessionQuery = (
  { __typename?: 'Query' }
  & { getSession: (
    { __typename?: 'Session' }
    & Pick<Session, 'id'>
  ) }
);

export type PaymentIntentListQueryVariables = Exact<{
  customerId: Scalars['String'];
  limit: Scalars['Float'];
}>;


export type PaymentIntentListQuery = (
  { __typename?: 'Query' }
  & { paymentIntentList: Array<(
    { __typename?: 'Transaction' }
    & Pick<Transaction, 'amount' | 'type' | 'date'>
  )> }
);

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'uid' | 'email' | 'roles' | 'displayName'>
  ) }
);

export type SetSettingsMutationVariables = Exact<{
  webhook: Scalars['String'];
  errorWebhook: Scalars['String'];
}>;


export type SetSettingsMutation = (
  { __typename?: 'Mutation' }
  & { settings: (
    { __typename?: 'Settings' }
    & Pick<Settings, 'webhook' | 'errorWebhook'>
  ) }
);


export const CreateTaskDocument = gql`
    mutation CreateTask($website: ID!, $tasks: [TaskInfos!]!, $raffle: ID!) {
  CreateTasks(tasks: $tasks, website: $website, raffle: $raffle) {
    success
    error
    code
  }
}
    `;
export type CreateTaskMutationFn = Apollo.MutationFunction<CreateTaskMutation, CreateTaskMutationVariables>;

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskMutation, { data, loading, error }] = useCreateTaskMutation({
 *   variables: {
 *      website: // value for 'website'
 *      tasks: // value for 'tasks'
 *      raffle: // value for 'raffle'
 *   },
 * });
 */
export function useCreateTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskMutation, CreateTaskMutationVariables>) {
        return Apollo.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, baseOptions);
      }
export type CreateTaskMutationHookResult = ReturnType<typeof useCreateTaskMutation>;
export type CreateTaskMutationResult = Apollo.MutationResult<CreateTaskMutation>;
export type CreateTaskMutationOptions = Apollo.BaseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>;
export const SignUpMailDocument = gql`
    mutation SignUpMail($recaptcha: String!, $email: String!, $firstName: String!, $lastName: String!) {
  SignUpMail(
    recaptcha: $recaptcha
    email: $email
    firstName: $firstName
    lastName: $lastName
  ) {
    id
  }
}
    `;
export type SignUpMailMutationFn = Apollo.MutationFunction<SignUpMailMutation, SignUpMailMutationVariables>;

/**
 * __useSignUpMailMutation__
 *
 * To run a mutation, you first call `useSignUpMailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMailMutation, { data, loading, error }] = useSignUpMailMutation({
 *   variables: {
 *      recaptcha: // value for 'recaptcha'
 *      email: // value for 'email'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *   },
 * });
 */
export function useSignUpMailMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMailMutation, SignUpMailMutationVariables>) {
        return Apollo.useMutation<SignUpMailMutation, SignUpMailMutationVariables>(SignUpMailDocument, baseOptions);
      }
export type SignUpMailMutationHookResult = ReturnType<typeof useSignUpMailMutation>;
export type SignUpMailMutationResult = Apollo.MutationResult<SignUpMailMutation>;
export type SignUpMailMutationOptions = Apollo.BaseMutationOptions<SignUpMailMutation, SignUpMailMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($recaptcha: String!, $email: String!, $password: String!, $key: String!, $alias: String!) {
  SignUp(
    recaptcha: $recaptcha
    email: $email
    password: $password
    key: $key
    alias: $alias
  ) {
    token
    accessToken
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      recaptcha: // value for 'recaptcha'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      key: // value for 'key'
 *      alias: // value for 'alias'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, baseOptions);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const SignUpBasicDocument = gql`
    mutation SignUpBasic($recaptcha: String!, $email: String!, $password: String!, $alias: String!) {
  SignUpBasic(
    recaptcha: $recaptcha
    email: $email
    password: $password
    alias: $alias
  ) {
    token
    accessToken
  }
}
    `;
export type SignUpBasicMutationFn = Apollo.MutationFunction<SignUpBasicMutation, SignUpBasicMutationVariables>;

/**
 * __useSignUpBasicMutation__
 *
 * To run a mutation, you first call `useSignUpBasicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpBasicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpBasicMutation, { data, loading, error }] = useSignUpBasicMutation({
 *   variables: {
 *      recaptcha: // value for 'recaptcha'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      alias: // value for 'alias'
 *   },
 * });
 */
export function useSignUpBasicMutation(baseOptions?: Apollo.MutationHookOptions<SignUpBasicMutation, SignUpBasicMutationVariables>) {
        return Apollo.useMutation<SignUpBasicMutation, SignUpBasicMutationVariables>(SignUpBasicDocument, baseOptions);
      }
export type SignUpBasicMutationHookResult = ReturnType<typeof useSignUpBasicMutation>;
export type SignUpBasicMutationResult = Apollo.MutationResult<SignUpBasicMutation>;
export type SignUpBasicMutationOptions = Apollo.BaseMutationOptions<SignUpBasicMutation, SignUpBasicMutationVariables>;
export const LogInDocument = gql`
    mutation LogIn($email: String!, $password: String!, $recaptcha: String!) {
  LogIn(email: $email, password: $password, recaptcha: $recaptcha) {
    token
    accessToken
  }
}
    `;
export type LogInMutationFn = Apollo.MutationFunction<LogInMutation, LogInMutationVariables>;

/**
 * __useLogInMutation__
 *
 * To run a mutation, you first call `useLogInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInMutation, { data, loading, error }] = useLogInMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      recaptcha: // value for 'recaptcha'
 *   },
 * });
 */
export function useLogInMutation(baseOptions?: Apollo.MutationHookOptions<LogInMutation, LogInMutationVariables>) {
        return Apollo.useMutation<LogInMutation, LogInMutationVariables>(LogInDocument, baseOptions);
      }
export type LogInMutationHookResult = ReturnType<typeof useLogInMutation>;
export type LogInMutationResult = Apollo.MutationResult<LogInMutation>;
export type LogInMutationOptions = Apollo.BaseMutationOptions<LogInMutation, LogInMutationVariables>;
export const KeyValidDocument = gql`
    query KeyValid($uuid: String!) {
  KeyValid(uuid: $uuid) {
    type
    uuid
  }
}
    `;

/**
 * __useKeyValidQuery__
 *
 * To run a query within a React component, call `useKeyValidQuery` and pass it any options that fit your needs.
 * When your component renders, `useKeyValidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeyValidQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useKeyValidQuery(baseOptions: Apollo.QueryHookOptions<KeyValidQuery, KeyValidQueryVariables>) {
        return Apollo.useQuery<KeyValidQuery, KeyValidQueryVariables>(KeyValidDocument, baseOptions);
      }
export function useKeyValidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeyValidQuery, KeyValidQueryVariables>) {
          return Apollo.useLazyQuery<KeyValidQuery, KeyValidQueryVariables>(KeyValidDocument, baseOptions);
        }
export type KeyValidQueryHookResult = ReturnType<typeof useKeyValidQuery>;
export type KeyValidLazyQueryHookResult = ReturnType<typeof useKeyValidLazyQuery>;
export type KeyValidQueryResult = Apollo.QueryResult<KeyValidQuery, KeyValidQueryVariables>;
export const CreateSessionDocument = gql`
    mutation createSession($priceId: String!, $customerId: String) {
  createSession(priceId: $priceId, customerId: $customerId) {
    id
  }
}
    `;
export type CreateSessionMutationFn = Apollo.MutationFunction<CreateSessionMutation, CreateSessionMutationVariables>;

/**
 * __useCreateSessionMutation__
 *
 * To run a mutation, you first call `useCreateSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSessionMutation, { data, loading, error }] = useCreateSessionMutation({
 *   variables: {
 *      priceId: // value for 'priceId'
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useCreateSessionMutation(baseOptions?: Apollo.MutationHookOptions<CreateSessionMutation, CreateSessionMutationVariables>) {
        return Apollo.useMutation<CreateSessionMutation, CreateSessionMutationVariables>(CreateSessionDocument, baseOptions);
      }
export type CreateSessionMutationHookResult = ReturnType<typeof useCreateSessionMutation>;
export type CreateSessionMutationResult = Apollo.MutationResult<CreateSessionMutation>;
export type CreateSessionMutationOptions = Apollo.BaseMutationOptions<CreateSessionMutation, CreateSessionMutationVariables>;
export const PaymentIntentDocument = gql`
    mutation paymentIntent($amount: Float!, $balance: Boolean!, $customerId: String!) {
  paymentIntent(amount: $amount, balance: $balance, customerId: $customerId) {
    id
  }
}
    `;
export type PaymentIntentMutationFn = Apollo.MutationFunction<PaymentIntentMutation, PaymentIntentMutationVariables>;

/**
 * __usePaymentIntentMutation__
 *
 * To run a mutation, you first call `usePaymentIntentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePaymentIntentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [paymentIntentMutation, { data, loading, error }] = usePaymentIntentMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      balance: // value for 'balance'
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function usePaymentIntentMutation(baseOptions?: Apollo.MutationHookOptions<PaymentIntentMutation, PaymentIntentMutationVariables>) {
        return Apollo.useMutation<PaymentIntentMutation, PaymentIntentMutationVariables>(PaymentIntentDocument, baseOptions);
      }
export type PaymentIntentMutationHookResult = ReturnType<typeof usePaymentIntentMutation>;
export type PaymentIntentMutationResult = Apollo.MutationResult<PaymentIntentMutation>;
export type PaymentIntentMutationOptions = Apollo.BaseMutationOptions<PaymentIntentMutation, PaymentIntentMutationVariables>;
export const GetSessionDocument = gql`
    query getSession {
  getSession {
    id
  }
}
    `;

/**
 * __useGetSessionQuery__
 *
 * To run a query within a React component, call `useGetSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSessionQuery(baseOptions?: Apollo.QueryHookOptions<GetSessionQuery, GetSessionQueryVariables>) {
        return Apollo.useQuery<GetSessionQuery, GetSessionQueryVariables>(GetSessionDocument, baseOptions);
      }
export function useGetSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSessionQuery, GetSessionQueryVariables>) {
          return Apollo.useLazyQuery<GetSessionQuery, GetSessionQueryVariables>(GetSessionDocument, baseOptions);
        }
export type GetSessionQueryHookResult = ReturnType<typeof useGetSessionQuery>;
export type GetSessionLazyQueryHookResult = ReturnType<typeof useGetSessionLazyQuery>;
export type GetSessionQueryResult = Apollo.QueryResult<GetSessionQuery, GetSessionQueryVariables>;
export const PaymentIntentListDocument = gql`
    query paymentIntentList($customerId: String!, $limit: Float!) {
  paymentIntentList(customerId: $customerId, limit: $limit) {
    amount
    type
    date
  }
}
    `;

/**
 * __usePaymentIntentListQuery__
 *
 * To run a query within a React component, call `usePaymentIntentListQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaymentIntentListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaymentIntentListQuery({
 *   variables: {
 *      customerId: // value for 'customerId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function usePaymentIntentListQuery(baseOptions: Apollo.QueryHookOptions<PaymentIntentListQuery, PaymentIntentListQueryVariables>) {
        return Apollo.useQuery<PaymentIntentListQuery, PaymentIntentListQueryVariables>(PaymentIntentListDocument, baseOptions);
      }
export function usePaymentIntentListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaymentIntentListQuery, PaymentIntentListQueryVariables>) {
          return Apollo.useLazyQuery<PaymentIntentListQuery, PaymentIntentListQueryVariables>(PaymentIntentListDocument, baseOptions);
        }
export type PaymentIntentListQueryHookResult = ReturnType<typeof usePaymentIntentListQuery>;
export type PaymentIntentListLazyQueryHookResult = ReturnType<typeof usePaymentIntentListLazyQuery>;
export type PaymentIntentListQueryResult = Apollo.QueryResult<PaymentIntentListQuery, PaymentIntentListQueryVariables>;
export const GetMeDocument = gql`
    query GetMe {
  me {
    uid
    email
    roles
    displayName
  }
}
    `;

/**
 * __useGetMeQuery__
 *
 * To run a query within a React component, call `useGetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeQuery(baseOptions?: Apollo.QueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
        return Apollo.useQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, baseOptions);
      }
export function useGetMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          return Apollo.useLazyQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, baseOptions);
        }
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>;
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>;
export type GetMeQueryResult = Apollo.QueryResult<GetMeQuery, GetMeQueryVariables>;
export const SetSettingsDocument = gql`
    mutation SetSettings($webhook: String!, $errorWebhook: String!) {
  settings(webhook: $webhook, errorWebhook: $errorWebhook) {
    webhook
    errorWebhook
  }
}
    `;
export type SetSettingsMutationFn = Apollo.MutationFunction<SetSettingsMutation, SetSettingsMutationVariables>;

/**
 * __useSetSettingsMutation__
 *
 * To run a mutation, you first call `useSetSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSettingsMutation, { data, loading, error }] = useSetSettingsMutation({
 *   variables: {
 *      webhook: // value for 'webhook'
 *      errorWebhook: // value for 'errorWebhook'
 *   },
 * });
 */
export function useSetSettingsMutation(baseOptions?: Apollo.MutationHookOptions<SetSettingsMutation, SetSettingsMutationVariables>) {
        return Apollo.useMutation<SetSettingsMutation, SetSettingsMutationVariables>(SetSettingsDocument, baseOptions);
      }
export type SetSettingsMutationHookResult = ReturnType<typeof useSetSettingsMutation>;
export type SetSettingsMutationResult = Apollo.MutationResult<SetSettingsMutation>;
export type SetSettingsMutationOptions = Apollo.BaseMutationOptions<SetSettingsMutation, SetSettingsMutationVariables>;