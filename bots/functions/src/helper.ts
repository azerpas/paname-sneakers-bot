import * as functions from 'firebase-functions';
import { Solver } from './capsolvers';
import { TwoCaptcha } from './capsolvers/twocaptcha';

/**
 * Returns a proxy from Luminati pool based on Timestamp and random (unique proxy)
 * @returns {Proxy}  
 */
const getProxy = (): Proxy => {
    return {
        ip: "",
        port: 8080,
        username: "",
        password: ""
    }
};

/**
 * Parse a proxy string to a valid Proxy type, needs to be this format:
 * http://{username}:{password}@{hostname/ip}:{port}
 * Ex: 
 * http://lum-customer-tom_leboss-zone-paname-country-fr:dzo4aem1dpq30@zproxy.lum-superproxy.io:22225
 * @param str 
 */
const parseProxy = ({str, options}: {str: string, options?: {luminatiSession?: boolean, luminatiCountry?: string}}): Proxy => {
    const url = str.replace("http://","").replace("https://","");
    const infos = url.split("@");
    const credentials = infos[0];
    const hostAndPort = infos[1];
    const luminatiSession = options ? (options.luminatiSession ? `-session-${new Date().getTime()}_${Math.floor(Math.random()*1000)}` : "") : "";
    const luminatiCountry = options ? (options.luminatiCountry ? `-country-${options.luminatiCountry}` : "") : "";
    return {
        ip: `${hostAndPort.split(":")[0]}`,
        port: parseInt(hostAndPort.split(":")[1]),
        username: `${credentials.split(":")[0]}${luminatiSession}${luminatiCountry}`,
        password: credentials.split(":")[1]
    }
}

/**
 * Solve captchas
 * @param sitekey - Retailer sitekey
 * @param url - Raffle URL
 * @param options
 * @returns {string}
 */
const solveCaptcha = async (sitekey: string, url: string, proxy: Proxy, options?: CaptchaOptions): Promise<string> => {
    const ANTI_TOKEN = functions.config().captcha.anti;
    const TWOCAP_TOKEN = functions.config().captcha.twocap;
    if(!ANTI_TOKEN && !TWOCAP_TOKEN) throw new ValueError("solveCaptcha requires either Anticaptcha or 2Captcha tokens.");
    let provider = "2captcha";
    let method = 0;
    let solver: Solver = new TwoCaptcha({sitekey, url, method, apiKey: TWOCAP_TOKEN, proxy, invisible: options?.invisible, version: options?.version, action: options?.action});
    if(options){
        if(options.provider){
            if( 
                ((options.provider === PROVIDERS.ANTICAPTCHA) && !ANTI_TOKEN) || 
                ((options.provider === PROVIDERS.TWOCATPCHA) && !TWOCAP_TOKEN) 
            ) throw new ValueError(`solveCatpcha needs a token for each provider: provider ${options.provider} missing token.`);
        }
        provider = options.provider ? options.provider : PROVIDERS.TWOCATPCHA;
        method = options.method ? options.method : METHOD.reCaptcha;
    }
    /* TODO: 
        - anticaptcha
    */
    
    if(provider === PROVIDERS.ANTICAPTCHA){
        console.error("TODO ! ANTICAPTCHA");
    }else {
        console.log(`TODO ! ${provider} provider`)
    }
    const id = await solver.sendRequest();
    const response =  await solver.getResult(id)
    return response;
};

const sleep = async (ms: number) => {
    return await new Promise( resolve => setTimeout(resolve, ms) )
}

const randomChoice = (arr: any[]) => {
    const l = arr.length;
    return arr[Math.floor(Math.random() * l)];
}

const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

type CaptchaOptions = {
    provider?: PROVIDERS;
    userAgent?: string;
    method?: METHOD;
    invisible?: boolean;
    version?: string;
    action?: string;
}

enum PROVIDERS {
    TWOCATPCHA="2captcha",
    ANTICAPTCHA="anticaptcha"
}

enum METHOD {
    reCaptcha,
    hCaptcha
}

class ValueError extends Error{
    constructor(message: string){
        super(message);
        Object.setPrototypeOf(this, ValueError.prototype);
    }
}

export { solveCaptcha, getProxy, parseProxy, sleep, randomChoice, randomBetween }

export { METHOD }

export { ValueError }