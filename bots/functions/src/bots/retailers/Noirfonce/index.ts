import { Typeform } from "../Typeform";

import * as functions from 'firebase-functions';
import { parseProxy, sleep } from "../../../helper";

type NoirProfile = {
    address: string;
    instagram: string;
    city: string;
    zip: string;
    country: string;
    phone: string;
} & Profile;

type NoirOptions = {
    size: string;
} & RaffleOptions;

class Noirfonce extends Typeform implements Bot {
    baseUrl: string;
    
    constructor(url: string){
        super(url);
        this.baseUrl = "";
    }

    /**
     * Make entry to raffle
     * @param {EntryOptions} options
     * @returns {Promise<EntryResponse>}
     */
    async makeEntry(options: NoirOptions, profile: NoirProfile, account=null): Promise<EntryResponse>{
        const proxy = parseProxy({str: functions.config().proxy.address, options: {luminatiSession: true, luminatiCountry: 'fr'}})
        global.GLOBAL_AGENT.HTTP_PROXY = `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`;
        global.GLOBAL_AGENT.NO_PROXY = "discord.com,2captcha.com";
        await Promise.all([
            new Promise(async (resolve, reject) => {
                await this.scrapeInfos();
                resolve(1);
            }),
            new Promise(async (resolve, reject) => {
                await sleep(500);
                await this.startSubmission();
                resolve(1);
            })
        ])
        await this.imitateInsights();
        return await this.submit(options.size, profile);
    }

    grabLink(){
        return "";
    }
}

export { Noirfonce }