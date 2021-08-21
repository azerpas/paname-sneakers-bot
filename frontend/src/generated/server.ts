import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../types/resolver';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  password: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  roles: Array<Maybe<Scalars['String']>>;
  tasks?: Maybe<Array<Maybe<Task>>>;
  profiles?: Maybe<Array<Maybe<Profile>>>;
};


export type UserTasksArgs = {
  number?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type UserProfilesArgs = {
  number?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['ID'];
  website: Scalars['String'];
  url: Scalars['String'];
  size?: Maybe<Scalars['String']>;
  Profile?: Maybe<Profile>;
};

export type Profile = {
  __typename?: 'Profile';
  id: Scalars['ID'];
  fname?: Maybe<Scalars['String']>;
  lname?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  address?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
};

export type Key = {
  __typename?: 'Key';
  id: Scalars['ID'];
  type?: Maybe<KeyType>;
  uuid?: Maybe<Scalars['String']>;
};

export enum KeyType {
  Alpha = 'alpha',
  Beta = 'beta',
  Free = 'free',
  Giveaway = 'giveaway'
}

export type Query = {
  __typename?: 'Query';
  me: User;
  task?: Maybe<Task>;
  profile?: Maybe<Profile>;
  profiles?: Maybe<Array<Maybe<Profile>>>;
  keyValid?: Maybe<Key>;
};


export type QueryTaskArgs = {
  id: Scalars['ID'];
};


export type QueryProfileArgs = {
  id: Scalars['ID'];
};


export type QueryKeyValidArgs = {
  uuid: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  launchTasks: TaskReponse;
  SignUp?: Maybe<Scalars['Boolean']>;
};


export type MutationLaunchTasksArgs = {
  tasks: Array<Maybe<Scalars['ID']>>;
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  key: Scalars['String'];
  recaptcha: Scalars['String'];
};

export type TaskReponse = {
  __typename?: 'TaskReponse';
  success?: Maybe<Scalars['Boolean']>;
  message: Scalars['String'];
  errors?: Maybe<Array<Maybe<Task>>>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  User: ResolverTypeWrapper<any>;
  ID: ResolverTypeWrapper<any>;
  String: ResolverTypeWrapper<any>;
  Int: ResolverTypeWrapper<any>;
  Task: ResolverTypeWrapper<any>;
  Profile: ResolverTypeWrapper<any>;
  Key: ResolverTypeWrapper<any>;
  KeyType: ResolverTypeWrapper<any>;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<any>;
  TaskReponse: ResolverTypeWrapper<any>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  User: any;
  ID: any;
  String: any;
  Int: any;
  Task: any;
  Profile: any;
  Key: any;
  Query: {};
  Mutation: {};
  Boolean: any;
  TaskReponse: any;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  roles?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  tasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Task']>>>, ParentType, ContextType, RequireFields<UserTasksArgs, never>>;
  profiles?: Resolver<Maybe<Array<Maybe<ResolversTypes['Profile']>>>, ParentType, ContextType, RequireFields<UserProfilesArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type TaskResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  website?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type ProfileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  fname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type KeyResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Key'] = ResolversParentTypes['Key']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['KeyType']>, ParentType, ContextType>;
  uuid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  task?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QueryTaskArgs, 'id'>>;
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType, RequireFields<QueryProfileArgs, 'id'>>;
  profiles?: Resolver<Maybe<Array<Maybe<ResolversTypes['Profile']>>>, ParentType, ContextType>;
  keyValid?: Resolver<Maybe<ResolversTypes['Key']>, ParentType, ContextType, RequireFields<QueryKeyValidArgs, 'uuid'>>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  launchTasks?: Resolver<ResolversTypes['TaskReponse'], ParentType, ContextType, RequireFields<MutationLaunchTasksArgs, 'tasks'>>;
  SignUp?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSignUpArgs, 'email' | 'password' | 'key' | 'recaptcha'>>;
}>;

export type TaskReponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskReponse'] = ResolversParentTypes['TaskReponse']> = ResolversObject<{
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['Task']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  User?: UserResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Key?: KeyResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  TaskReponse?: TaskReponseResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
