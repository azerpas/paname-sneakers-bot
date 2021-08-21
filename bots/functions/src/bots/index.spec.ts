import { parseProxy, randomBetween } from "../helper";
import * as bots from "./index";
import * as functions from 'firebase-functions';

jest.setTimeout(30000);

test("Retrieve every bots", async () => {
    const proxy = parseProxy({str: functions.config().proxy.address, options: {luminatiSession: true, luminatiCountry: 'fr'}})
    global.GLOBAL_AGENT.HTTP_PROXY = `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`;
    global.GLOBAL_AGENT.NO_PROXY = "discord.com,2captcha.com"
    const frFaker = await import("faker/locale/fr");
    let count = 0;
    let errors = [];
    for(let i in bots){
        console.log(`${i}`);
        // @ts-ignore
        const klass = bots[`${i}`];
        // find link from API
        // find link from grabLink()
        console.log(klass);
        let link : undefined | string = "";
        const bot = new klass(link);
        try {
            link = await bot.grabLink();
        } catch (error) {
            if(error instanceof TypeError){
                console.warn(`No grab link function found for ${i}`);
                continue;
            }else{
                console.error(error);
                throw new Error(error);
            }
        }
        if(!link || link === ""){
            throw new Error(`Link is still undefined`);
        }else{
            const fullOptions = {
                size: 43,
                colorway: "Black",
                directUrl: link
            }
            const fullProfile = {
                fname: frFaker.name.firstName(),  
                lname: frFaker.name.lastName(),  
                email: "",
                city: frFaker.address.city(),  
                address: frFaker.address.streetAddress(),  
                housenumber: randomBetween(1,4000), 
                country: "France",  
                zip: frFaker.address.zipCode(),  
                instagram: frFaker.internet.userName()
            }
            fullProfile.email = frFaker.internet.email(fullProfile.fname, fullProfile.lname);
            fullProfile.instagram = frFaker.internet.userName(fullProfile.fname);
            const entry: EntryResponse = await bot.makeEntry(fullOptions, fullProfile);
            if(!entry.error) count++;
            else errors.push(i);
            console.log(`${i}: status code ${entry.finalStatusCode}`);
            console.log(entry);
        }
    }
    console.log(`Sites working ${count}`);
    console.log(`Sites not working ${errors.length}`);
});