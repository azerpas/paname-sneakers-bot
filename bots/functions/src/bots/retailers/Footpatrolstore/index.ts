import got from 'got';
import { parseProxy } from "../../../helper";
import * as functions from 'firebase-functions';
import cheerio from "cheerio"
import * as Faker from 'faker';
import { CookieJar } from "tough-cookie";
import * as urlHelper from "url";

import 'global-agent/bootstrap';
import { sendError } from '../../../discord';

type FootpatrolProps = Profile & {
    phone: string;
    city: string;
    country: string;
}

type FootpatrolRaffleOptions = RaffleOptions & {
    colorway: string;
}

class FootpatrolStore implements Bot{
    
    baseUrl: string;

    constructor(baseUrl: string = "https://footpatrol.s3.amazonaws.com/content/site/2017/RaffleForm_Assets/"){
        this.baseUrl = baseUrl;
    }

    /**
     * Make entry to raffle
     * @param {EntryOptions} options
     * @returns {Promise<EntryResponse>}
     */
    async makeEntry(options: FootpatrolRaffleOptions, profile: FootpatrolProps, account=null): Promise<EntryResponse>{
        const proxy = parseProxy({str: functions.config().proxy.address, options: {luminatiSession: true, luminatiCountry: 'fr'}})
        global.GLOBAL_AGENT.HTTP_PROXY = `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`;
        global.GLOBAL_AGENT.NO_PROXY = "discord.com"
        const url = options ? ( options.url ? this.baseUrl + options.url : (options.directUrl ? options.directUrl : this.baseUrl )) : this.baseUrl;
        
        functions.logger.log("Proxies: ");
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
                'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
                'Connection': 'keep-alive',
                'Cache-Control': 'max-age=0',
                'Upgrade-Insecure-Requests': '1',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Sec-Fetch-Site': 'cross-site',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-User': '?1',
                'Sec-Fetch-Dest': 'document',
                'Accept-Language': 'en,en-US;q=0.9,fr;q=0.8'
            },
            cookieJar: cookieJar
        });

        const rep = await client.get(url);

        const $ = cheerio.load(rep.body);

        const colorway = this.getColor($, options.colorway);
        const size = this.getSize($, String(options.size));

        const parsed = urlHelper.parse(url).search!.split("?");
        const params = {
            tag  : parsed[1].split('=')[1],
            shortTag : parsed[2].split('=')[1],
            productName: parsed[3].split('=').pop()!.split('-'),
            imgURL : parsed[4].split('=')[1]
         };

        const postUrl = `https://redeye.footpatrol.com/cgi-bin/rr/blank.gif?nourl=${params.tag}&firstName=${encodeURI(profile.fname+" "+profile.lname)}&email=${encodeURI(profile.email)}&telephone=${encodeURI(profile.phone)}&${params.shortTag}_shoetype=${colorway}&fr_adidas_shoesize=${size}&fr_adidas_cityofres=${encodeURI(profile.city)}&yzemail=${params.tag}&${params.shortTag}_countryofres=${encodeURI(profile.country)}&emailpermit=1&agepermit=Y&sms_optout=0&site=FP&currency=GBP`;
        functions.logger.log(postUrl)
        try {
            const response = await client.get(postUrl, {
                headers: {
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    'Sec-Fetch-Site': 'cross-site',
                    'Sec-Fetch-Mode': 'no-cors',
                    'Sec-Fetch-Dest': 'image',
                    'Referer': 'https://footpatrol.s3.amazonaws.com/',
                    'Accept-Language': 'en,en-US;q=0.9,fr;q=0.8',
                },
                timeout: 5000
            });
            functions.logger.log("Response from FP: ");
            functions.logger.log(response.statusCode);
            functions.logger.log(response.body);

            try {
                functions.logger.log("Deactivated proxy");
            } catch (error) {
                await sendError({error: "Canno't deactivate proxy", website: this.constructor.name, size, url, user: "Not detected", productName: "", email: profile.email, thumbnail: ""})
            }
            
            if(response.statusCode === 200){
                functions.logger.log("Success");
                return { finalStatusCode: response.statusCode, responseText: "Success!", error: null };
            }else{
                return { finalStatusCode: 500, responseText: `Error with status code (${response.statusCode}): `+response.body, error: {message: response.body, originalError: null} };
            }
        } catch (error) {
            functions.logger.error("Error while sending request to FP")
            functions.logger.error(error)
            return {
                finalStatusCode: 500, 
                responseText: "Error while sending request to FP",
                error: {message: `Error: ${error.message}`, originalError: error}
            };
        }        
        
    }

    grabLink(){
        return "";
    }

    getSize($: cheerio.Root, inputSize: string | undefined){
        const sizes = $('#shoeSize option').toArray();
        functions.logger.log(sizes.length);
        functions.logger.log($(sizes[0]).text());
        if(inputSize){
            for(const size of sizes){
                const sizeTag = $(size);
                if(!sizeTag || !sizeTag.attr("value")) continue;
                if(sizeTag.attr("value")! !== "") {
                    if(sizeTag.text().includes(inputSize)){
                        return sizeTag.attr("value")!;
                    }
                }   
            }
        }
        $(sizes[0]).remove()
        functions.logger.log("Select random size");
        functions.logger.log($(sizes));
        functions.logger.log($(sizes[1]).text());
        const randomSize = $(sizes[Math.floor(Math.random() * sizes.length)]);
        return randomSize.attr("value")!;
    }
    
    getColor($: cheerio.Root, color: string){
        const shoetypes = $("#shoetype").find("option");
        shoetypes.map((i, el) => {
            if($(el).attr("value") !== "" && $(el).attr("value") !== undefined){
                if(color.toLowerCase().includes( $(el).attr("value")!.toLowerCase() )){
                    return $(el).attr("value")!;
                }
            }
        });
        
        $(shoetypes[0]).remove();
        functions.logger.log("Select random color");
        functions.logger.log($(shoetypes[1]).text());
        const randomColor = $(shoetypes[Math.floor(Math.random() * shoetypes.length)]);
        return randomColor.attr("value")!;
    }

}

export { FootpatrolStore }