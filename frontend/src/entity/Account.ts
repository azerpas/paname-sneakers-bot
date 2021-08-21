import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm"
import { FirebaseUser } from "./FirebaseUser";

@Entity()
export class Account {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    email: string;

    @Column()
    password: string;
    
    @ManyToOne('FirebaseUser', 'accounts')
    @JoinColumn({name: "firebase_user_id"})
    firebaseUser: FirebaseUser;
}
