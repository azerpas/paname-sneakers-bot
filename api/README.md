# API

This API has been created with [API Platform](https://api-platform.com/), check out their [documentation](https://api-platform.com/docs/distribution) for specific customization.

## Features
- Docker Compose support
- Firebase Auth support
- Role-based restrictions
- Stripe support

## Installation
### Requirements
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Make sure no process is running on port `5432` or `8443`
### Steps
- Navigate to this folder
- In the `./config` folder, replace the service account file by yours or complete it. Rename it to `serv-acc.json`. ([How to get my Service Account file?](https://firebase.google.com/docs/admin/setup#initialize-sdk))
- In the root folder, complete the `.env` file with your variables
- `docker-compose up -d`
- Navigate to `https://localhost:8443`
#### __Populate the database__
- Navigate to the root folder (same as `setup.sql`)
- Modify the values as you wish
- Connect to the database with `psql` (user, password, and database are configurated inside `.env` file)
- Run these commands:
    - `\c api` (use `api` database - or whatever your db name is)
    - `\i setup.sql`

## Interact with the API
### Introduction
- API Rest schema can be found here: [API](https://api.paname.io/)
- GraphQL schema can be found here: [GraphQL](https://api.paname.io/graphql/graphql_playground)       
**or** here: [GraphQLi](https://api.paname.io/graphql)
- Most of the time, the entities will be ROLES blocked, check the *collectionOperations* and *itemOperations* inside [each entity](https://github.com/azerpas/paname-api/tree/master/src/Entity).
### Auth
- Authentification is based off Firebase, that's why you need to login through your account on https://paname.io/login first
- You will need the access token returned. You can find it in the following requests (Network tab in your Browser):      
#### __On login request__
In the login response POST:/api/graphql "accessToken" field, **and not** the "token" field.
![accessToken](https://user-images.githubusercontent.com/19282069/107741571-b85c6f00-6d0d-11eb-9c13-4dd8b79e3fb1.png)
#### __On every request made to the API__
Just scrape what’s after Bearer in the authorization header
![authorization](https://user-images.githubusercontent.com/19282069/107741419-6a476b80-6d0d-11eb-831a-e904fd7958c9.png)
### Postman 
- Create a request
- Set the authorization header in Bearer mode
![bearer](https://user-images.githubusercontent.com/19282069/107741820-2d2fa900-6d0e-11eb-8059-3baa5e0dab48.png)
- Set-up your request thanks to the [SwaggerUI or GraphQL playground](#Introduction) that you can find above
### Example: Add a website
- In SwaggerUI, find the website entity
![website](https://user-images.githubusercontent.com/19282069/107741968-7a137f80-6d0e-11eb-8e2b-b547ca4c7a1b.png)
- Here's a body example of the ressource
![ressource](https://user-images.githubusercontent.com/19282069/107742057-a3cca680-6d0e-11eb-99ac-2b35de74a3ff.png)
- Set-up the selector to `application/json` instead of `application/ld+json`
- On the web api, click on `Try Out`
- Copy the whole body
- On Postman, Body, set `raw` and `JSON`
- Paste previous data
- Modify the data to your need
- ⛔️ "fields" needs to contain the differents field in the [right order](https://github.com/azerpas/paname-next/blob/169e35158db3df60e7c811544f06ff354f77eefa/src/constants/tasks.ts#L1)
- ⚠️ "estimatedProxyCost" needs to be set-up in the [right format](https://github.com/azerpas/paname-api/blob/1e0efa731e5925b14f34d139a82335b0f9e379e2/src/Entity/Website.php#L107)
- ⚠️ "estimatedCaptchaCost" is calculed by the number of `(2,99 / 1000) * {number_of_recaptcha_to_be_solved}` (2.99€: current rate /1000 recaptcha) 
- ⚠️ "raffles" needs to be empty because the website isn't linked to any raffle yet
- ⚠️ "handledBy": 'f' *or* 'c' 
