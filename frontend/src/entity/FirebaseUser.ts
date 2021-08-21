import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinColumn} from "typeorm"
import { Profile } from "./Profile";
import { Raffle } from "./Raffle";
import { Account } from "./Account";

@Entity()
export class FirebaseUser {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "firebase_id"})
    firebaseId: string;

    @Column({name: "user_type"})
    userType: string;

    @Column()
    alias: string;

    @OneToMany('Profile', 'firebaseUser')
    profiles: Profile[];

    @ManyToOne('Product', 'firebaseUsers')
    @JoinColumn({name: "unlocked_id"})
    unlocked: Raffle[];

    @ManyToMany('Raffle')
    Raffles: Raffle[];

    @OneToMany('Account', 'firebaseUser')
    accounts: Account[];

    @Column({ array: true })
    roles: string;

    @Column()
    balance: number;

    @Column({name: "customer_id"})
    customerId: string;

    @Column({name: "sub_checkout_session"})
    subCheckoutSession: string;

    @Column()
    paying: boolean;

    @Column({name: "discord_webhook"})
    discordWebhook: string;

    @Column({name: "discord_webhook_error"})
    discordWebhookError: string;
}
