import got from 'got';
import { parseProxy, solveCaptcha } from "../../../helper";
import * as functions from 'firebase-functions';
import cheerio from "cheerio"
import * as Faker from 'faker';
import { CookieJar } from "tough-cookie";

import 'global-agent/bootstrap';
import { sendError } from '../../../discord';

type VooProfile = Profile & {
    phone: string;
    address: string;
    housenumber: string;
    zip: string;
    city: string;
    country: string;
}

class VooBerlin implements Bot{
    
    baseUrl: string;
    //* Site key */
    st: string;

    constructor(baseUrl: string = "https://raffle.vooberlin.com/index.php"){
        this.baseUrl = baseUrl;
        this.st = "6LdAleIZAAAAABixzXghKZgv4g3_PMSVThBNiC_9";
    }

    /**
     * Make entry to raffle
     * @param {EntryOptions} options
     * @returns {Promise<EntryResponse>}
     */
    async makeEntry(options: RaffleOptions, profile: VooProfile, account=null): Promise<EntryResponse>{
        const proxy = parseProxy({str: functions.config().proxy.address, options: {luminatiSession: true, luminatiCountry: 'fr'}})
        global.GLOBAL_AGENT.HTTP_PROXY = `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`;
        global.GLOBAL_AGENT.NO_PROXY = "discord.com,2captcha.com"
        const url = options ? ( options.url ? this.baseUrl + options.url : (options.directUrl ? options.directUrl : this.baseUrl )) : this.baseUrl;
        
        functions.logger.log("Proxies: ");
        functions.logger.log(process.env.GLOBAL_AGENT_HTTP_PROXY);
        functions.logger.log(global.GLOBAL_AGENT.HTTP_PROXY);
        functions.logger.log(global.GLOBAL_AGENT.NO_PROXY);
        functions.logger.log("Profile: ");
        functions.logger.log(profile);
        functions.logger.log("Url: ");
        functions.logger.log(url);

        const cookieJar = new CookieJar();
        const client = got.extend({
            headers: {
                'user-agent': Faker.internet.userAgent(),
                'authority': 'raffle.vooberlin.com',
                'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
                'x-requested-with': 'XMLHttpRequest',
                'sec-ch-ua-mobile': '?0',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'accept-language': 'en,en-US;q=0.9,fr;q=0.8',
            },
            cookieJar: cookieJar
        });

        const rep = await client.get(url);

        const $ = cheerio.load(rep.body);
        const token = $("input[name='token']").attr("value");
        const pageId = $("input[name='page_id']").attr("value");
        let sitekey: string | undefined = undefined;
        let scriptTag: string | null = null;
        const reg = /execute\("(.*)",/gm;
        $("script").map((i, el) => {
            if($(el).html()?.includes("recaptcha")){
                scriptTag = $(el).html();
                if(scriptTag){
                    sitekey = reg.exec(scriptTag)![1];
                }
            }
        });
        if(!sitekey) sitekey = this.st; 

        const size = this.getSize($, String(options.size));

        /* TODO: handle ERROR_PROXY_CONNECTION_FAILED
        try {
            
        } catch (error) {
            //ERROR_PROXY_CONNECTION_FAILED
        }
        */
        const recaptcha = await solveCaptcha(sitekey, url, {...proxy}, {invisible: true, version: "v3", action: "validate_captcha"})
        functions.logger.log(`Recaptcha response: ${recaptcha}`)
        
        const body = `token=${token}&page_id=${pageId}&g-recaptcha-response=${encodeURI(recaptcha)}&shoes_size=${size}&action=send_request&fax=&name=${encodeURI(profile.fname)}&lastname=${encodeURI(profile.lname)}&email=${encodeURI(profile.email)}&contact_number=${encodeURI(profile.phone)}&streetname=${encodeURI(profile.address)}&housenumber=${encodeURI(profile.housenumber)}&postalcode=${encodeURI(profile.zip)}&city=${encodeURI(profile.city)}&country=${encodeURI(profile.country)}&countryhidden=`;
        const headers = {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'origin': 'https://raffle.vooberlin.com',
            'referer': url
        }

        try {
            const response = await client.post("https://raffle.vooberlin.com/ajax.php", {
                body,
                headers: {
                    ...headers
                },
                responseType: "text",
                timeout: 20000
            });
            functions.logger.log("Response from Voo: ");
            functions.logger.log(response.statusCode);
            functions.logger.log(response.body);

            try {
                global.GLOBAL_AGENT.HTTP_PROXY = undefined;
                functions.logger.log("Deactivated proxy");
            } catch (error) {
                await sendError({error: "Canno't deactivate proxy", website: this.constructor.name, size, url, user: "Not detected", productName: "", email: profile.email, thumbnail: "",})
            }
            
            if(response.statusCode === 200){
                try {
                    const js = JSON.parse(response.body);
                    if(!js.error){
                        functions.logger.log("Success");
                        return { finalStatusCode: response.statusCode, responseText: js.msg, error: null };
                    }else{
                        return { finalStatusCode: 500, responseText: js.msg, error: {message: js.msg, originalError: null} };
                    }
                } catch (error) {
                    functions.logger.error("Error while sending request to Voo")
                    functions.logger.error(error)
                    return {
                        finalStatusCode: 500, 
                        responseText: "Error while decoding response from voo",
                        error: {message: `Response: ${response.body}\nError: ${error.message}`, originalError: error}
                    };
                }
            }else{
                return {
                    finalStatusCode: response.statusCode, 
                    responseText: response.statusCode === 200 ? JSON.parse(response.body) : "Error: "+response.body,
                    error: {message: `Captured response ${response.statusCode}. Error: ${response.body}`, originalError: response.body}
                };
            }
        } catch (error) {
            functions.logger.error("Error while sending request to Voo")
            functions.logger.error(error)
            return {
                finalStatusCode: 500, 
                responseText: "Error while sending request to Voo",
                error: {message: `Error: ${error.message}`, originalError: error}
            };
        }

        // 200 {"error":false,"msg":"SUCCESS! Your request is sent. Please note that you will not receive a confirmation email after submitting your raffle entry. ","redirect_time":5000,"redirect_url":"https:\/\/www.vooberlin.com"}
        
        
    }

    grabLink(){
        return "";
    }

    getSize($: cheerio.Root, inputSize: string | undefined){
        const sizes = $('.shoes-sizen-mp li').toArray();
        functions.logger.log(sizes.length);
        functions.logger.log($(sizes[0]).text());
        if(inputSize){
            for(const size of sizes){
                const sizeTag = $(size);
                if(!sizeTag || !sizeTag.attr("id")) continue;
                if(sizeTag.attr("id")!.includes('li_')) {
                    if(sizeTag.text().includes(inputSize)){
                        return sizeTag.attr("id")!.replace("li_","");
                    }
                }   
            }
        }
        $(sizes[0]).remove()
        functions.logger.log($(sizes[1]).text());
        const randomSize = $(sizes[Math.floor(Math.random() * sizes.length)]);
        return randomSize.attr("id")!.replace("li_","");
    }

}

export { VooBerlin }