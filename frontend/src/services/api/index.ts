import { FirebaseUser } from "@entity/FirebaseUser";
import { Raffle } from "@entity/Raffle";
import { UserInputError } from "apollo-server";
import getConnection from "../../index";

enum Method {
    "POST",
    "GET",
    "PATCH",
    "PUT",
    "DELETE"
}

export const getRaffle = async (id: number): Promise<Raffle> => {
    try {
        const connection = await getConnection();
        const raffleRepo = await connection.getRepository(Raffle);
        const raffle = await raffleRepo.findOne({where: {id}, select: ['id','raffleType', 'url'], relations: ['product']});
        if(raffle){
            return raffle;
        }else{
            throw new UserInputError("No raffle found.");
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
} 

export const updateBalance = async (
    userId: number,
    amount: number,
): Promise<number> => {
    try {
        const connection = await getConnection();
        const userRepo = await connection.getRepository(FirebaseUser);
        const user = await userRepo.findOne({where: {id: userId}, select: ['id', 'balance']});
        if(user){
            user.balance += amount;
            await connection.manager.save(user);
            return user.balance;
        }else{
            throw new UserInputError("No user found !");
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}