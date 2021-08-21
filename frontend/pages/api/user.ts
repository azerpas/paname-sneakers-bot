import { NextApiRequest, NextApiResponse } from 'next';
import firebase from 'firebase';
import firebaseAdmin from '@utils/auth/admin';

const handler = async (req: any, res: NextApiResponse) => {
    const session = req.cookies!.session;
    const CHECK_REVOKED = true;
    const me = await firebaseAdmin
        .auth()
        .verifySessionCookie(session, CHECK_REVOKED)
        .then(async claims => {
            return (await firebaseAdmin.auth().getUser(claims.uid));
        })
        .catch((error: firebaseAdmin.FirebaseError) => {
            res.status(401).json({'message': error.message}) // auth/session-cookie-revoked 
            throw Error(error.message);
        });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(me.toJSON()))
}

export default handler;