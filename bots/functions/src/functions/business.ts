import * as functions from 'firebase-functions';
import * as bots from '../bots';
import 'global-agent/bootstrap';

import got from 'got';
import { sendEntrySuccess, sendError, sendPayPalWebhook } from '../discord';

export const businessTask = functions.firestore.document('business-tasks/{taskId}').onCreate( async (change, context)=>{
    let res = null;
    let a = null;
    functions.logger.info('Launching a business task');
    try {
        switch(change.data().site.handledBy) { 
            case "f": { 
                functions.logger.log("Launching a js supported raffle")
                functions.logger.info(change, {structuredData: true});
                functions.logger.info(change.data(), {structuredData: true});
                switch (change.data().site.name) {
                    case "Voo Berlin":
                        a = new bots.VooBerlin();
                        res = await a.makeEntry(
                            {directUrl: change.data().raffle.url, size: change.data().profile.size},
                            {
                                fname: change.data().profile.fname, lname: change.data().profile.lname, email: change.data().profile.email, phone: change.data().profile.phone,
                                address: change.data().profile.address,
                                housenumber: change.data().profile.housenumber,
                                city: change.data().profile.city,
                                zip: change.data().profile.zip, 
                                country: change.data().profile.country
                            },
                            null // account
                        );
                        functions.logger.info(res.responseText, {structuredData: true});
                        functions.logger.info(res.error, {structuredData: true});
                        break;
                    case "FootpatrolStore":
                        a = new bots.FootpatrolStore();
                        res = await a.makeEntry(
                            {directUrl: change.data().raffle.url, size: change.data().profile.size, colorway: change.data().raffle.product.colorway},
                            {
                                fname: change.data().profile.fname, lname: change.data().profile.lname, email: change.data().profile.email, phone: change.data().profile.phone,
                                city: change.data().profile.city,
                                country: change.data().profile.country
                            },
                            null // account
                        );
                        functions.logger.info(res.responseText, {structuredData: true});
                        functions.logger.info(res.error, {structuredData: true});
                        break;
                    case "Azerpas":
                        a = new bots.Azerpas("http://entries.azerpas.com");
                        res = await a.makeEntry(
                            {url: "/createEntry", size: change.data().size, colorway: "Mocha"},
                            {fname: change.data().profile.fname, lname: change.data().profile.lname, email: change.data().profile.email, phone: change.data().profile.phone},
                            null // account
                        );
                        functions.logger.info(res.responseText, {structuredData: true});
                        functions.logger.info(res.error, {structuredData: true});
                        break;
                    case "JDFR":
                        a = new bots.JDFR();
                        res = await a.makeEntry(
                            {directUrl: change.data().raffle.url, size: change.data().profile.size, colorway: change.data().raffle.product.colorway},
                            {
                                fname: change.data().profile.fname, lname: change.data().profile.lname, email: change.data().profile.email, phone: change.data().profile.phone,
                                city: change.data().profile.city, address: change.data().profile.address, housenumber: change.data().profile.housenumber,
                                country: change.data().profile.country, zip: change.data().profile.zip, paypal: change.data().profile.paypal
                            }
                        );
                        functions.logger.info(res.responseText, {structuredData: true});
                        functions.logger.info(res.error, {structuredData: true});
                        break;
                    case "Shuzulab":
                        a = new bots.Shuzu(change.data().raffle.url);
                        res = await a.makeEntry(
                            {size: change.data().profile.size},
                            {
                                fname: change.data().profile.fname, 
                                lname: change.data().profile.lname, 
                                email: change.data().profile.email,
                                country: change.data().profile.country,
                            },
                            null // account
                        );
                        functions.logger.info(res.responseText, {structuredData: true});
                        functions.logger.info(res.error, {structuredData: true});
                        break;
                    case "Starcow":
                        a = new bots.Starcow();
                        res = await a.makeEntry(
                            {size: change.data().profile.size, directUrl: change.data().raffle.url},
                            {
                                fname: change.data().profile.fname, 
                                lname: change.data().profile.lname, 
                                email: change.data().profile.email,
                                city: change.data().profile.city, address: change.data().profile.address, housenumber: change.data().profile.housenumber,
                                country: change.data().profile.country, zip: change.data().profile.zip, instagram: change.data().profile.instagram
                            },
                            null // account
                        );
                        functions.logger.info(res.responseText, {structuredData: true});
                        functions.logger.info(res.error, {structuredData: true});
                        break;
                    case "Overkill":
                        a = new bots.Overkill();
                        res = await a.makeEntry(
                            {size: change.data().profile.size, directUrl: change.data().raffle.url},
                            {
                                fname: change.data().profile.fname, 
                                lname: change.data().profile.lname, 
                                email: change.data().profile.email,
                                city: change.data().profile.city, address: change.data().profile.address, housenumber: change.data().profile.housenumber,
                                country: change.data().profile.country, zip: change.data().profile.zip, instagram: change.data().profile.instagram
                            },
                            null // account
                        );
                        functions.logger.info(res.responseText, {structuredData: true});
                        functions.logger.info(res.error, {structuredData: true});
                        break;
                    case "Noirfonce":
                        a = new bots.Noirfonce(change.data().raffle.url);
                        res = await a.makeEntry(
                            {size: change.data().profile.size},
                            {
                                fname: change.data().profile.fname, 
                                lname: change.data().profile.lname, 
                                email: change.data().profile.email, 
                                phone: change.data().profile.phone,
                                city: change.data().profile.city, 
                                address: change.data().profile.address, 
                                housenumber: change.data().profile.housenumber,
                                country: change.data().profile.country, 
                                zip: change.data().profile.zip,
                                instagram: change.data().profile.instagram
                            },
                            null // account
                        );
                        functions.logger.info(res.responseText, {structuredData: true});
                        functions.logger.info(res.error, {structuredData: true});
                        break;
                    default:
                        break;
                }
                break;
            }
            case "c":{
                console.log("Launching a cloudrun supported raffle")
                console.log(functions.config().cloudrun.url)
                try {
                    const {statusCode}: {statusCode: number, body: string} = await got.post(functions.config().cloudrun.url, {
                        json: {
                            data : change.data(),
                        },
                    });
                    const entry: EntryResponse = {
                        finalStatusCode: statusCode, 
                        responseText: statusCode === 200 ? "Success" : "Error",
                        error: null
                    };
                    console.log(entry);
                } catch (error) {
                    const entry: EntryResponse = {
                        finalStatusCode: 400, 
                        responseText: error.message,
                        error: null
                    };
                    console.log(entry);
                }
            }
            break;
        }
    } catch (error) {
        functions.logger.error("Error while making an entry")
        functions.logger.error(error)
        await sendError({
            error: error.message,
            website: change.data().site.name, 
            size: change.data().profile.size, 
            url: change.data().raffle.url, 
            customWebhook: change.data().user.errorWebhook,
            user: change.data().user.firebaseId,
            productName: "", email: change.data().profile.email, thumbnail: "",
            discord: undefined // TODO: add discord to list of data to pass on
        });
    }
    
    functions.logger.log(`Completion...`);
    if(change.data().site.handledBy === "f" && !res!.error){
        functions.logger.info(`Sending success!`);
        await sendEntrySuccess({
            website: change.data().site.name, 
            size: change.data().profile.size, 
            url: change.data().raffle.url, 
            customWebhook: change.data().user.discordWebhook,
            productName: change.data().raffle.product.name, email: change.data().profile.email, thumbnail: change.data().raffle.product.imageUrl,
            discord: undefined // TODO: add discord to list of data to pass on
        });
        if(res!.paypalUrl){
            await sendPayPalWebhook({
                customWebhook: change.data().user.discordWebhook,
                paypalUrl: res!.paypalUrl,
                website: change.data().site.name, 
                size: change.data().profile.size, 
                url: change.data().raffle.url, 
                productName: change.data().raffle.product.name, email: change.data().profile.email, thumbnail: change.data().raffle.product.imageUrl,
            })
        }
    }else if(change.data().site.handledBy === "f" && res?.error){
        functions.logger.error(`Sending error!`);
        await sendError({
            error: res.error.message,
            originalError: res.error.originalError,
            website: change.data().site.name,
            size: change.data().profile.size, 
            url: change.data().raffle.url, 
            customWebhook: change.data().user.errorWebhook,
            user: change.data().user.firebaseId,
            productName: "", email: change.data().profile.email, thumbnail: "",
            discord: undefined // TODO: add discord to list of data to pass on
        });
    }else{
        functions.logger.error(`Not a function, shutting down... ${res}`);
    }
});