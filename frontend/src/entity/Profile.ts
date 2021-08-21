import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm"
import { FirebaseUser } from "./FirebaseUser";

@Entity()
export class Profile {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fname: string;

    @Column()
    lname: string;

    @Column()
    address: string;

    @Column()
    address2: string;

    @Column()
    zip: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @ManyToOne('FirebaseUser', 'profiles')
    firebaseUser: FirebaseUser;

    @Column()
    name: string;
    
    @CreateDateColumn()
    dob: Date;

    @Column()
    state: string;

}
