// Firebase(store)
import adminApp from '../../../utils/auth/admin';
// User
import { User } from '../../../generated/server';

export const keyExists = async (uuid: string) => {
    let snapshot = await adminApp.firestore().collection("keys").where("uuid", "==", uuid).get();
    return !snapshot.empty ? { uuid: uuid, type: snapshot.docs[0].data().type } : undefined;
}

export const createUser = async (values: User) => {
    const user = await adminApp.auth().createUser({email: values.email, password: values.password});
    const userData = {
        key: values.key,
        roles: values.roles,
        email: values.email
    }
    const userMeta = await adminApp.firestore().collection("users").doc(user.uid).set(userData);
    return user.uid;
}