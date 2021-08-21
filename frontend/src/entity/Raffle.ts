import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn} from "typeorm"
import { FirebaseUser } from "./FirebaseUser";
import { Product } from "./Product";

@Entity()
export class Raffle
{
    @PrimaryGeneratedColumn()
    id: number;
    
    @CreateDateColumn({name:"created_at"})
    createdAt: Date;
    
    @CreateDateColumn({name:"updated_at"})
    updatedAt: Date;

    @Column({name:"website_id"})
    website: string;

    @ManyToOne('Product', 'raffles')
    @JoinColumn({name: "product_id"})
    product: Product;

    @CreateDateColumn({name:"start_at"})
    startAt: Date;
    
    @CreateDateColumn({name:"end_at"})
    endAt: Date;

    @Column({name:"raffle_type"})
    raffleType: string;

    @OneToMany('FirebaseUser', 'raffles')
    firebaseUsers: FirebaseUser;

    @Column({name: "url"})
    url: string;
}
