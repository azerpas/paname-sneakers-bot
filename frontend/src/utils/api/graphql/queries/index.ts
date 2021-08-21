export const GET_PROFILES_NAMES = /* GraphQL */`
    query {
        profiles{
            edges{
                node{
                    name
                }
            }
        }
    }
`;

export const GET_WEBSITES = /* GraphQL */`
    query {
        websites{
            edges{
                node{
                    id
                    name
                    status
                    lastTestedAt
                    estimatedCaptchaCost
                    estimatedProxyCost
                    fields
                    working
                    handledBy
                    published
                    guide{
                        id
                    }
                }
            }
        }
    }
`;

export const GET_RAFFLES = /* GraphQL */`
    query ($websiteId: ID!){
        collectionQueryRaffles(website: $websiteId){
          edges{
            node{
                _id
                endAt
                product{
                    id
                    name
                    imageUrl
                    pid
                    colorway
                    releaseAt
                }
            }
          }
        }
    }
`;

export const GET_WEBSITES_RAFFLES = /* GraphQL */`
    query{
        websites{
            edges{
                node{
                    id
                    name
                    published
                    raffles{
                        edges{
                            node{
                                id
                                url
                                endAt
                                product{
                                    name
                                    _id
                                    colorway
                                    imageUrl
                                    pid
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_GUIDE = /* GraphQL */`
    query($id: ID!){
        guide(id: $id){
            email
            name
            instagram
            address
            phone
        }
    }
`;