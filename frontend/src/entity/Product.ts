import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from "typeorm"
import { FirebaseUser } from "./FirebaseUser";
import { Raffle } from "./Raffle";

@Entity()
export class Product
{
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    brand: string;

    @CreateDateColumn({name: "release_at"})
    releaseAt: Date;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @CreateDateColumn({name: "updated_at"})
    updatedAt: Date;

    @Column()
    pid: string;

    @Column()
    price: number;

    @Column({name: "image_url"})
    imageUrl: string;

    @Column()
    colorway: string;

    @Column()
    public: boolean;

    @OneToMany('Raffle', 'product')
    raffles: Raffle[];

    @OneToMany('FirebaseUser', 'unlocked')
    firebaseUsers: FirebaseUser;
}
