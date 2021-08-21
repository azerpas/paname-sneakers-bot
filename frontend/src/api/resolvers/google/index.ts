import fetch from 'isomorphic-unfetch';
import {RECAPTCHA_ENDPOINT} from '../../../constants/google';

export default async ({response, ip}: {response: string, ip: string}) => {
    const data = [`secret=${process.env.RECAPTCHA_SECRET}`, `response=${response}`, ip ? `remoteip=${ip}` : ``].join("&");
    return fetch(RECAPTCHA_ENDPOINT,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        }
    );
}