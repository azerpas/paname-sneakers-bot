# Paname-Next

Based on [NextJS](https://nextjs.org/docs/)

## TODO: 
Recap in Notion.so     
https://www.notion.so/f1dc16688af848a4873e4cea449a4a94?v=b9fb86f6b0ed475fbcc991889da68211     
- [ ] Permissions on API (Admin, User)       
FirebaseUsers:PATCH - verify token from Stripe

## Stack

**Front-end:**
- Framework: `NextJS`     
・Vercel App: https://paname.io 
・Lighthouse: https://vercel.com/azerpas/paname-next/integrations/icfg_bljGHkCMcnKxkFX2Jxugkqjr
- UI: `Material UI` and `styled-components`    
- State management: `useState`      
- Payment: `Stripe`     
- `apollo-client`

**API:**
・API Platform: https://api.paname.io
- `graphql`  
- `apollo-server`      
- `api-platform`

**Storage:**      
- `Firestore`   
- `Postgresql`     

**Serverless:** 
- Functions: `Cloud functions`     
- VMs: `Cloud Run`  

**Deployment:**    
- CI/CD: `Github` and `GCP` (or Github actions)   
- Container: ~~`Docker` and `Kubernetes` and `Spinnaker`~~    
![IMG](https://cloud.google.com/solutions/images/spin-flow1.svg?hl=fr)
 
**Testing:**     
- `Jest`    

**Project management:**      
- `Notion`

**Customer service**
- `Crisp`
https://app.crisp.chat/settings/      
https://help.crisp.chat/en/article/how-to-use-crisp-javascript-sdk-10ud15y/

## Tree view

```
/
│
├── declarations/ # Type declaration for TypeScript
│
├── lib / # GraphQL type declaration (abandonned)
│   └── ... 
│
├── pages/ # NextJS .tsx pages. 
│   ├── api/ # API mini server
│   │   ├── graphql.ts # Apollo Server
│   │   └── ... 
│   │
│   ├── basic/ # To use with "basic" free paname plan
│   │   └── ... 
│   │
│   ├── index.tsx # Landing page
│   ├── dashboard.tsx # 
│   ├── ...
│   ├── _document.tsx # Control style and custom head, body...
│   └── _app.tsx # Control page initialization
│
├── public/ # public files
│   └── ...
│
├── src/ # Source files
│   │
│   ├── api/ # API helpers
│   │   ├── middleware/ # Run code before or after a resolver request has been executed
│   │   │   ├── global/ 
│   │   │   └── resolver/
│   │   └── resolvers/ # Run code when called by GraphQL Apollo Server
│   │       └── ... # This code will be generated into @src/generated thanks to type-graghql and graphql-codegen
|   |
│   ├── apollo/ # Apollo Server helpers
│   │   ├── withApollo.tsx # Apollo Wrapper to use Apollo Client on specific components and not the whole app
│   │   ├── client.ts # Apollo Context to use Client on the whole app (abandonned)
│   │   └── schema.ts # GraphQL schema from resolvers in @src/api/resolvers
│   │    
│   ├── components/ # NextJS reusable components 
│   │   ├── ...
│   │   └── components.tsx # Contains colors of Paname
│   │
│   ├── constants/ # Reusable constants
│   │    └── ...
│   │
│   ├── context/ # React.Context components
│   │    └── ...
│   │
│   ├── entity/ # Entities of Database. Will be used with TypeORM to communicate with DB without API.
│   │    └── ...
|   |
│   ├── generated/ # Generated files from @src/api/resolvers and @src/queries thanks to graphql-codegen
│   │   ├── server.ts # Server only generated queries, types, mutation...
│   │   └── client.ts # Client only generated queries, types, mutation...
│   │
│   ├── queries/ # Graphql queries for client use with graphql-tag module
│   │    └── ...
│   │
│   ├── services/ # Utils functions for each external service (stripe, firestore, ...)
│   │    └── ...
│   │
│   ├── store/ # Redux (abandonned)
│   │    └── ...
│   │
│   ├── types/ # or @typeDefs, type definition to use inside the whole app with Typescript
│   │    └── ...
│   │
│   └── utils/ # API helpers
│       ├── api/ # Communicate with external api: api.paname.io
│       │   ├── graphql/ # graphql queries and helpers
│       │   │   └── ...
│       │   └── rest/ # rest helpers functions
│       │       └── ...
│       │
│       ├── auth/ # Run code before or after a resolver request has been executed
│       │   ├── admin.ts # Run Firebase admin code
│       │   ├── client.ts # Run Firebase client code 
│       │   ├── init.ts # Init Firebase
│       │   └── sessionHandler.ts # (Abandonned)
│       │
│       └── middleware/ # (Abandonned)
│           └── ... 
│
├── .gitignore # ignored git files 
├── .babelrc # babel config with module resolving (@...)
├── Dockerfile # (WIP)
├── codegen.yml # graphql-codegen setup
├── next.config.js # NextJS experimental features
├── ormconfig.json # typeORM configuration 
├── tsconfig.json # typescript configuration
└── ...
```

## Task files
When modifying the entity Task (profile of a task mostly), you need to modify it in a few files:
- [In the resolver type-graphql object (class TaskInfos)](src/api/resolvers/dashboard/index.ts)
- [The constant array that has all the keys in an array](src/constants/tasks.ts)
- [In the graphql schema](src/queries/dashboard.ts)
- Then, run `yarn dev` and in another term `yarn codegen` to generate the types


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) 

## Typescript

[Typescript docs](https://nextjs.org/docs/basic-features/typescript)

- `/pages/api` .js to .ts
- `/pages` .js to .tsx
