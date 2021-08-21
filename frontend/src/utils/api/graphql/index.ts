import { GraphQLScalarType } from 'graphql';
import { request, GraphQLClient } from 'graphql-request';

export const client = async (
    token: string,
    query: string,
    variables?: any
) => {
    const API = process.env.NEXT_PUBLIC_API+"/graphql" || '';
    const client = new GraphQLClient(API, {headers : { authorization: `Bearer ${token}`, origin: `${process.env.NEXT_PUBLIC_BASE_URL}`}})
    try{
        const {data, status, errors} = await client.rawRequest(query, variables);
        return data as any;
    }catch(error){
        if(error.response.status == 401) throw new Error(`${error.response.status}`);
        else throw new Error(error);
    }
}