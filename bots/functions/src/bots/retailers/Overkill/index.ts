import * as functions from 'firebase-functions';
import { parseProxy } from "../../../helper";
import { GoogleForm } from "../GoogleForm";

type OverkillProfile = {
    country: string;
    housenumber: string;
    address: string;
    zip: string;
    city: string;
    instagram: string;
} & Profile;

type OverkillOptions = {
    size: number;
} & RaffleOptions;

class Overkill extends GoogleForm implements Bot {
    
    constructor(baseUrl: string = "https://docs.google.com/forms/d/e/"){
        super(baseUrl);
    }

    /**
     * Make entry to raffle
     * @param {EntryOptions} options
     * @returns {Promise<EntryResponse>}
     */
    async makeEntry(options: OverkillOptions, profile: OverkillProfile, account=null): Promise<EntryResponse>{
        const proxy = parseProxy({str: functions.config().proxy.address, options: {luminatiSession: true, luminatiCountry: 'fr'}})
        global.GLOBAL_AGENT.HTTP_PROXY = `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`;
        global.GLOBAL_AGENT.NO_PROXY = "discord.com,2captcha.com";
        const url = options ? ( options.url ? this.baseUrl + options.url : (options.directUrl ? options.directUrl : this.baseUrl )) : this.baseUrl;
        try {
            return await super.makeEntry(
                {
                    directUrl: url, 
                    size: options.size
                },
                {
                    ...profile
                },
                null // account
            );
        } catch (error) {
            throw new Error(error); 
        }
    }

    grabLink(){
        return "";
    }
}

export { Overkill }