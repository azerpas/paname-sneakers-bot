import got from 'got';
import FormData from 'form-data';
import { parseProxy, ValueError } from "../../../helper";
import * as functions from 'firebase-functions';

import 'global-agent/bootstrap';

class Azerpas implements Bot{
    
    baseUrl: string;

    constructor(baseUrl: string = "http://entries.azerpas.com"){
        this.baseUrl = baseUrl;
    }

    /**
     * Make entry to raffle
     * @param {EntryOptions} options
     * @returns {Promise<EntryResponse>}
     */
    async makeEntry(options: RaffleOptions, profile: Profile, account=null){
        if(!profile) throw new ValueError("makeEntry require profile.");
        const proxy = parseProxy({str: functions.config().proxy.address, options: {luminatiSession: true, luminatiCountry: 'fr'}})
        global.GLOBAL_AGENT.HTTP_PROXY = `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`;
        global.GLOBAL_AGENT.NO_PROXY = "discord.com,2captcha.com"
        functions.logger.log("Proxies: ");
        functions.logger.log(process.env.GLOBAL_AGENT_HTTP_PROXY);
        functions.logger.log(functions.config().proxy.address);
        functions.logger.log("Profile: ");
        functions.logger.log(profile);
        const url = options ? ( options.url ? this.baseUrl + options.url : (options.directUrl ? options.directUrl : this.baseUrl )) : this.baseUrl;
        const form = new FormData();
        if(profile.fname) form.append("fname", profile.fname);
        if(profile.lname) form.append("lname", profile.lname);
        if(profile.email) form.append('email', profile.email);
        if(profile.phone) form.append('phone', profile.phone);
        if(options.size) form.append('size', options.size);
        if(options.colorway) form.append('colorway', options.colorway);
        functions.logger.log(url);
        const {statusCode}: {statusCode: number, body: string} = await got.post(url, {
            body: form,
            headers: {
                'user-agent': '@azerpas/Functions'
            }
        });
        const entry: EntryResponse = {
            finalStatusCode: statusCode, 
            responseText: statusCode === 200 ? "Success" : "Error",
            error: null
        };
        return entry;
    }

    grabLink(){
        return "http://entries.azerpas.com/createEntry";
    }

}

export { Azerpas }