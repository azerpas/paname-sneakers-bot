import got, { Got } from 'got';
import { parseProxy, solveCaptcha } from "../../../helper";
import * as functions from 'firebase-functions';
import * as Faker from 'faker';
import { CookieJar } from "tough-cookie";
import * as urlHelper from "url";

import 'global-agent/bootstrap';
import { sendError } from '../../../discord';

type JDFRProps = Profile & {
    phone: string;
    address: string;
    city: string;
    zip: string;
    housenumber: string;
    paypal: string;
}

type FootpatrolRaffleOptions = RaffleOptions & {
    colorway: string;
}

type JDJsonData = {
    id: string, 
    site_code: string, 
    product_name: string,
    product_image: string,
    thanks_message: string,
    /**
     * "2021-03-10T11:00:00.000Z"
     */
    raffle_end_date: string,
    closing_text: string,
    captcha: string,
    size_options: {[key: string]: string},
    dial_codes: string[],
    locale?: string
}

class JDFR implements Bot{
    
    baseUrl: string;

    constructor(baseUrl: string = "https://nk7vfpucy5.execute-api.eu-west-1.amazonaws.com/prod/save_entry"){
        this.baseUrl = baseUrl;
    }

    /**
     * Make entry to raffle
     * @param {EntryOptions} options
     * @returns {Promise<EntryResponse>}
     */
    async makeEntry(options: FootpatrolRaffleOptions, profile: JDFRProps, account=null): Promise<EntryResponse>{
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
                'sec-ch-ua': '"Chromium";v="89", "Google Chrome";v="89", ";Not A Brand";v="99"',
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

        const id = urlHelper.parse(url).pathname!.split("-").slice(-1)[0];
        const timestamp = Date.now();
        const ressourceUrl = `https://raffles-resources.jdsports.co.uk/raffles/raffles_${id}.js?_=${timestamp}`;
        let rep = null;
        try {
            rep = await client.get(ressourceUrl);
            if(rep === null){
                throw new Error(`Can't access to JD data page`);
            }
        }catch(error){
            functions.logger.error("Error while retrieving data from JD")
            functions.logger.error(error)
            return {
                finalStatusCode: 500, 
                responseText: "Error while retrieving data from JD",
                error: {message: `Error: ${error.message}`, originalError: error}
            };
        }
        
        const regex = /var raffles = (.+);/ms;
        const parsedJson = regex.exec(rep.body);
        if(parsedJson && parsedJson.length < 2) throw new Error(`Canno't read the response from JD (1): ${rep.body}`)
        const js: JDJsonData = JSON.parse(parsedJson![1])[0];

        const size = this.getSize(js.size_options, String(options.size));
        const locale = (js['locale']) ? js['locale'] : urlHelper.parse(url).hostname!.split('.').slice(-1)[0].replace("/", "") || "fr";
        const requirements = await Promise.all([
            this.validationPreAuth(client),
            solveCaptcha(js.captcha, url, {...proxy}, {invisible: true, version: "v3", action: locale})
        ])
        const recaptcha = requirements[1];
        functions.logger.log(`Recaptcha response: ${recaptcha}`)
        const birth = Faker.date.between(new Date(1980, 1, 1), new Date(2001, 1, 1))
        const body = JSON.stringify({
            "firstName":profile.fname,
            "rafflesID": id,
            "lastName":profile.lname,
            "email":profile.email,
            "paypalEmail":profile.paypal,
            "mobile":js.dial_codes[0]+profile.phone,
            "dateofBirth":`${birth.getDate() < 10 ? "0" + birth.getDate() : birth.getDate()}/${birth.getMonth() < 10 ? "0" + birth.getMonth() : birth.getMonth()}/${birth.getFullYear()}`,
            "shoeSize":size,
            "address1":profile.housenumber+ " " + profile.address,
            "address2":"",
            "city":profile.city,
            "county":"",
            "siteCode":js.site_code,
            "postCode":profile.zip,
            "hostname":"https://" + urlHelper.parse(url).hostname,
            "sms_optin":0,
            "email_optin":1,
            "token":recaptcha
        })
        functions.logger.log(body);
        try {
            const response = await client.post(this.baseUrl, {
                headers: {
                    'Host': 'nk7vfpucy5.execute-api.eu-west-1.amazonaws.com',
                    'accept': 'text/plain, */*; q=0.01',
                    'sec-ch-ua-mobile': '?0',
                    'sec-fetch-site': 'cross-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'content-type': 'application/json',
                    'origin': "https://" + urlHelper.parse(url).hostname,
                    'referer': "https://" + urlHelper.parse(url).hostname,
                    'accept-language': 'en,en-US;q=0.9,fr;q=0.8',
                },
                body,
                timeout: 5000,
                responseType: 'text'
            });
            functions.logger.log("Response from JD: ");
            functions.logger.log(response.statusCode);
            functions.logger.log(response.body);
            const res = JSON.parse(response.body);
            if(res.code !== 201){
                return {
                    finalStatusCode: 500, 
                    responseText: response.body,
                    error: {message: `Error while making a request to JD: ${response.statusCode} ${response.body}`, originalError: ""}
                };
            }
            const {pre_auth} = res;
            const pre_auth_token = urlHelper.parse(pre_auth, true).query.preauth;
            //{"code": 201,"result": "Thank you for your entry","status": true,"success": true,"pre_auth": "https://raffles-checkout.jdsports.fr?preauth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnRyeUlEIjoiN0ZDQllLNUtMNCIsImVtYWlsQWRkcmVzcyI6ImZyZWRAZ214LmZyIiwic2l0ZUNvZGUiOiJKREZSIiwicmFmZmxlSUQiOjkxNCwiaWF0IjoxNjE1MDIzNDg2LCJleHAiOjE2MTUwMjcwODZ9.Rd8RoQjj3jnS8AH2lFZCTjuwNXkfZj10WTJ5IqbcxbE"}
            const body2 = JSON.stringify({"pre_auth_token":pre_auth_token});
            const miniCheckoutUrl = `https://raffles-checkout-api.jdsports.co.uk/mini_checkout/siteCode/${js.site_code}`;
            const response2 = await client.post(miniCheckoutUrl, {
                headers: {
                    'Host': 'raffles-checkout-api.jdsports.co.uk',
                    'accept': 'application/json, text/plain, */*',
                    'sec-ch-ua-mobile': '?0',
                    'content-type': 'application/json',
                    'origin': "https://" + urlHelper.parse(pre_auth).hostname,
                    'referer': "https://" + urlHelper.parse(pre_auth).hostname,
                    'accept-language': 'en,en-US;q=0.9,fr;q=0.8',
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: body2,
                timeout: 5000,
                responseType: 'text'
            });
            functions.logger.log("Response2 from JD: ");
            functions.logger.log(response2.statusCode);
            functions.logger.log(response2.body);
            //{"message": "Raffle loaded successfully.","code": 200,"body": {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnRyeUlEIjoiUjBJWVVTT0gwTSIsInJhZmZsZUlEIjo5MTQsInNpdGVDb2RlIjoiSkRGUiIsImlhdCI6MTYxNDg1MTk3MiwiZXhwIjoxNjE0ODU1NTcyfQ.5WnYjX8oG4BTF4_HjVgkM5-pxn9jl-PGH_BuopUt2P4","data": {"name": "Nike Dunk High - White/ Orange Blaze","pre_auth": 1,"currency": "€","price": 110,"shipping_prices": "0.00","size": "42","product_url": "https://raffles-resources.jdsports.co.uk/images/product_czssaenzy3_914_JDFR.jpg","infoMessage": "Once you have completed Paypal, your payment will be held, and you have committed to purchasing the product if you win. If you win, payment will be taken from your account and your product will be sent to your provided delivery address after the draw has closed. If you are unsuccessful, your payment will be released after the completion of the promotion. Depending on your bank, this may take 3-5 days. You’ll receive an email notification if you are successful or unsuccessful once the draw has been completed. Full Terms & Conditions are available below and on our website."}}}
            const bodyPay = JSON.stringify({"paymentMethod":"PAYPAL"});
            const responsePay = await client.post("https://raffles-checkout-api.jdsports.co.uk/payments/init_Payment", {
                headers: {
                    'Host': 'raffles-checkout-api.jdsports.co.uk',
                    'accept': 'application/json, text/plain, */*',
                    'sec-ch-ua-mobile': '?0',
                    'content-type': 'application/json',
                    'origin': "https://" + urlHelper.parse(pre_auth).hostname,
                    'referer': "https://" + urlHelper.parse(pre_auth).hostname,
                    'x-api-token': pre_auth_token,
                    'accept-language': 'en,en-US;q=0.9,fr;q=0.8',
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: bodyPay,
                timeout: 5000,
                responseType: 'text'
            });
            functions.logger.log("ResponsePay from JD: ");
            functions.logger.log(responsePay.statusCode);
            functions.logger.log(responsePay.body);
            const jsPay: {message:string, code: number, body: { redirectUrl: { href: string, method: string }, return_url: string, cancel_url: string, raffle_id: string, token: string, country_code: string}} = JSON.parse(responsePay.body);
            //{"message": "Payment initiated successfully.","code": 200,"body": {"redirectUrl": {"href": "https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-6H772218YY610000E","method": "REDIRECT"},"return_url": "https://raffles-checkout.jdsports.fr/payment_success","cancel_url": "https://raffles-checkout.jdsports.fr/payment_failure","raffle_id": 914,"site_code": "JDFR","country_code": "FR","token": "EC-6H772218YY610000E"}}
            functions.logger.log("redirect url: ");
            functions.logger.log(jsPay.body.redirectUrl.href);


            try {
                functions.logger.log("Deactivated proxy");
            } catch (error) {
                await sendError({error: "Canno't deactivate proxy", website: this.constructor.name, size, url, user: "Not detected", productName: "", email: profile.email, thumbnail: ""})
            }
            
            if(response.statusCode === 201){
                functions.logger.log("Success");
                return { finalStatusCode: response.statusCode, responseText: js.thanks_message, error: null, paypalUrl: jsPay.body.redirectUrl.href };
            }else{
                return { finalStatusCode: 500, responseText: `Error with status code (${response.statusCode}): `+response.body, error: {message: response.body, originalError: null} };
            }
        } catch (error) {
            functions.logger.error("Error while sending request to JD")
            functions.logger.error(error)
            if(error.response){
                functions.logger.error(error.response.body);
                return {
                    finalStatusCode: 500, responseText: "Error while sending request to JD",
                    error: {message: `Error: ${error.response.statusCode} ${error.response.body}`, originalError: error}
                };
            }
            return {
                finalStatusCode: 500,  responseText: "Error while sending request to JD", error: {message: `Error: ${error.message}`, originalError: error}
            };
        }        
        
    }

    grabLink(){
        return "";
    }

    getSize(sizes: {[key: string]: string}, inputSize: string | undefined){
        functions.logger.log(Object.keys(sizes).length);
        functions.logger.log(Object.keys(sizes));
        if(inputSize){
            for(const [k, v] of Object.entries(sizes)){
                if(!v || !k) continue;
                if(v.includes(inputSize)){
                    return k;
                }  
            }
        }
        functions.logger.log("Select random size");
        functions.logger.log(Object.keys(sizes)[0]);
        const randomSize = Object.keys(sizes)[Math.floor(Math.random() * Object.keys(sizes).length)];
        return randomSize;
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

    async validationPreAuth(client: Got){
        const timestamp = Date.now();
        const url = `https://raffles-resources.jdsports.co.uk/js/validations_pre_auth.js?_=${timestamp}`;
        try {
            await client.get(url, {timeout: 15000})
        } catch (error) {
            functions.logger.error("Could not submit request to validation pre auth")
            functions.logger.error(error)
        }
    }

}

export { JDFR }