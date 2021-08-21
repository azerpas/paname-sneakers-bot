import { Account } from "@entity/Account";
import { FirebaseUser } from "@entity/FirebaseUser";
import { Product } from "@entity/Product";
import { Profile } from "@entity/Profile";
import { Raffle } from "@entity/Raffle";
import "reflect-metadata";
import {createConnection, getConnection} from "typeorm";

export default async () => {
    let connection;
    try{
        connection = await getConnection();
        if (connection.isConnected) {
            await connection.close();
        }
    }catch(e) {}
    try {
        connection = await createConnection({
            type: process.env.DATABASE_TYPE as any,
            host: process.env.DATABASE_HOST as any,
            port: process.env.DATABASE_PORT as any,
            username: process.env.DATABASE_USERNAME as any,
            password: process.env.DATABASE_PASSWORD as any,
            database: process.env.DATABASE_NAME as any,
            synchronize: false,
            connectTimeoutMS: 10000,
            ssl: process.env.NODE_ENV !== "production" ? undefined : {   
                rejectUnauthorized: false
            },
            entities: [
                FirebaseUser, Profile, Account, Raffle, Product
            ]
        });
        return connection;
    } catch (error) {
        throw new Error("DB error: "+error.message);   
    }
}

