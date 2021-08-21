import { Typeform } from "../Typeform";

import * as functions from 'firebase-functions';
import { parseProxy } from "../../../helper";

type ShuzuProfile = {
    country: string;
} & Profile;

type ShuzuOptions = {
    size: string;
} & RaffleOptions;

class Shuzu extends Typeform implements Bot {
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
    async makeEntry(options: ShuzuOptions, profile: ShuzuProfile, account=null): Promise<EntryResponse>{
        const proxy = parseProxy({str: functions.config().proxy.address, options: {luminatiSession: true, luminatiCountry: 'fr'}})
        global.GLOBAL_AGENT.HTTP_PROXY = `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`;
        global.GLOBAL_AGENT.NO_PROXY = "discord.com,2captcha.com";
        await this.scrapeInfos();
        await this.startSubmission();
        await this.imitateInsights();
        return await this.submit(options.size, profile);
    }

    grabLink(){
        return "";
    }
}

export { Shuzu }