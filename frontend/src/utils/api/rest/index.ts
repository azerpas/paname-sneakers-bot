import { FirebaseUser } from "@typeDefs/user";
import FormData from "form-data";
import { Method } from "got/dist/source";


export const fetcher = async (
    url: string,
    token: string,
    strict?: boolean
) => {
    const res = await fetch(url, {headers: { 'accept': 'application/json', 'authorization': `Bearer ${token}`, 'origin': `${process.env.NEXT_PUBLIC_BASE_URL}` }});
    if(res.status == 401) throw Error(res.status.toString());
    if(strict && res.status !== 200) throw Error(res.status.toString());
    return res.json();
}

export const userRoles = async (
    token: string,
    user: FirebaseUser
) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Origin", `${process.env.NEXT_PUBLIC_BASE_URL}`);
    let formdata = new FormData();
    for (const role of user.roles) {
        formdata.append("roles[]", role);
    }
    formdata.append("type", user.type);
    //@ts-ignore
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/user`, { method: "POST", headers: myHeaders, body: formdata, redirect: 'follow' });
    if(res.status == 401) throw Error(res.status.toString());
    if(res.status == 404 || res.status == 400 || res.status == 403){
        const data = await res.json();
        throw Error(data.message);
    };
    if(res.status == 200) return {success: true};
    else return {success: false, status: res.status, body: res.body}
}

/**
 * 
 * @param token Firebase access token
 * @param method HTTP Method
 * @param userId int id
 * @param amount amount to add or remove
 */
export const userBalance = async (
    token: string,
    method: Method,
    userId: number,
    amount: number,
    server?: boolean 
) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    if(server) myHeaders.append("Admin", "1");
    myHeaders.append("Origin", `${process.env.NEXT_PUBLIC_BASE_URL}`);
    let formdata = new FormData();
    if(method === "post" || method === "POST") formdata.append("cost", amount);
    if(method === "put" || method === "PUT") formdata.append("amount", amount);
    //@ts-ignore
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/user/${userId}/balance`, { method: method, headers: myHeaders, body: formdata, redirect: 'follow' });
    if(res.status == 401) throw Error(res.status.toString());
    if(res.status == 200) return {success: true};
    else return {success: false, status: res.status, body: await res.json()}
}

export const userCheckout = async (
    token: string,
    method: Method,
    userId: number,
    checkoutId: string,
    customerId: string,
    server?: boolean
) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    if(server) myHeaders.append("Admin", "1");
    myHeaders.append("Origin", `${process.env.NEXT_PUBLIC_BASE_URL}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/user/${userId}/checkout`, { 
        method: method, headers: myHeaders, 
        body: method === "put" || method === "PUT" ? JSON.stringify({"sessionId": checkoutId, "customerId": customerId}) : null, 
        redirect: 'follow' 
    });
    if(res.status === 401) throw Error(res.status.toString());
    if(res.status === 201) return {success: true};
    else{
        throw Error(res.status.toString() + ": " + await res.json());
    }
}