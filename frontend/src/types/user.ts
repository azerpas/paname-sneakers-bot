import * as firebaseAdminVanilla from 'firebase-admin';

export type User = firebaseAdminVanilla.auth.UserRecord;

export type FirebaseUser = {
    uid: string,
    pseudo?: string,
    roles: string[],
    type?: string,
    balance: number,
    profiles?: any[],
    raffles?: any[],
    accounts?: any[]
}