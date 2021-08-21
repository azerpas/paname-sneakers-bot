import gql from 'graphql-tag';

export const taskFragment = gql`
    type Task {
        website: String!
        taskInfos: TaskInfos
    }

    type TaskInfos {
        size: String!
        email: String!
        fname: String!
        lname: String!
        phone: String
        housenumber: String
        address: String
        address2: String
        state: String
        city: String
        zip: String
        country: String
        utils: String
        instagram: String
        faker: String
        paypal: String
        password: String
        birthdate: String
        username: String
    }
`;

export const CREATE_TASKS = gql`
    ${taskFragment}
    mutation CreateTask(
        $website: ID!
        $tasks: [TaskInfos!]!
        $raffle: ID!
    ){
        CreateTasks(tasks: $tasks, website: $website, raffle: $raffle){
            success
            error
            code
        }
    }
`;