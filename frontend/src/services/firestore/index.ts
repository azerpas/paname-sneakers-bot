// Firebase(store)
import adminApp from '@utils/auth/admin';

export const keyExists = async (uuid: string): Promise<{uid: string, uuid: string, type: string} | undefined> => {
    let snapshot = await adminApp.firestore().collection("keys").where("uuid", "==", uuid).get();
    return !snapshot.empty && !snapshot.docs[0].data().uid ? { uid: snapshot.docs[0].id, uuid: uuid, type: snapshot.docs[0].data().type } : undefined;
}