import got from 'got';
import { parseProxy, randomBetween } from "../../../helper";
import * as functions from 'firebase-functions';
import * as Faker from 'faker';
import cheerio from "cheerio"
import { CookieJar } from "tough-cookie";
import 'global-agent/bootstrap';
import { Field } from './types';

class GoogleForm implements Bot{
    
    baseUrl: string;
    form: string | undefined;
    fbzx: string | undefined ;

    constructor(baseUrl: string = "https://docs.google.com/forms/d/e/"){
        this.baseUrl = baseUrl;
        this.form = "";
    }

    /**
     * Make entry to raffle
     * @param {EntryOptions} options
     * @returns {Promise<EntryResponse>}
     */
    async makeEntry(options: RaffleOptions, profile: Profile, account=null): Promise<EntryResponse>{
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
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
                'Origin': 'https://docs.google.com',
            },
            cookieJar: cookieJar
        });

        const rep = await client.get(url);
        // $ act as a document. Check cheerio doc.
        let $ = cheerio.load(rep.body);
        let form_id = "";
        try {
            form_id = rep.url.split('/')[6];
        } catch (error) {
            throw new Error(`${error.message} : ${rep.url} with first url being ${url}`);
        }
        const body = rep.body;
        if(
            body.includes('is no longer accepting responses')
            || body.includes("Il n'est plus possible de répondre au formulaire")
        ) throw new Error(`The form is no longer accepting responses.`)
        if(!body.includes('var FB_PUBLIC_LOAD_DATA_ = ')) 
        {
            console.error(body);
            throw new Error(`Form does not contain FB_PUBLIC_LOAD_DATA_, check the logs`);
        }
        const script = JSON.parse(body.split('var FB_PUBLIC_LOAD_DATA_ = ')[1].split(';')[0]);
        this.createData(script, profile, options);
        functions.logger.log(`Form state after data addition:`);
        functions.logger.log(this.form);
        this.getInputs($);
        functions.logger.log(`Form state after input scrapping:`);
        functions.logger.log(this.form);
        const postUrl = `https://docs.google.com/forms/u/0/d/e/${form_id}/formResponse`;
        functions.logger.log(postUrl);
        //throw new Error(":(");
        this.form = this.form!.substring(0, this.form!.length -1);
        try {
            const response = await client.post(postUrl, {
                headers: {
                    'user-agent': Faker.internet.userAgent(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
                    'Referer': `https://docs.google.com/forms/d/e/${form_id}/viewform?fbzx=${this.fbzx}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Origin': 'https://docs.google.com',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'TE': 'Trailers',
                },
                body: this.form,
                timeout: 5000
            });
            functions.logger.log("Response from Google: ");
            functions.logger.log(response.statusCode);
            functions.logger.log(response.body);

            if(response.statusCode === 200){
                functions.logger.log("Success");
                try {
                    functions.logger.log("Getting confirmation message...");
                    $ = cheerio.load(response.body);
                    const divWin = $('.freebirdFormviewerViewResponseConfirmationMessage');
                    functions.logger.log(divWin.text());
                    return { finalStatusCode: response.statusCode, responseText: divWin.text(), error: null };
                } catch (error) {
                    functions.logger.error("Error while trying to get confirmation message: "+error.message);
                }
                return { finalStatusCode: response.statusCode, responseText: "Success!", error: null };
            }else{
                return { finalStatusCode: 500, responseText: `Error with status code (${response.statusCode}): `+'Missing field', error: {message: 'Missing field', originalError: null} };
            }
        } catch (error) {
            if(error.response){
                functions.logger.error(error.response)
            }
            functions.logger.error("Error while sending request to GF")
            functions.logger.error(error)
            functions.logger.log(`Form state sent:`);
            functions.logger.log(this.form);
            return {
                finalStatusCode: 500, 
                responseText: "Error while sending request to GF",
                error: {message: `Error: ${error.message}`, originalError: error}
            };
        }        
        
    }

    grabLink(){
        return "";
    }

    createData(script: any, profile: Profile, options: RaffleOptions){
        const full_name_pattern = ['full name', 'fullname', 'whole name', 'entire name']
        const first_name_pattern = ['first name', 'First Name', 'First name', 'prénom', 'Prénom', 'prenom', 'Prenom']
        const last_name_pattern = ['last name', 'Last Name', 'Last name', 'Surname', 'surname', 'nom', 'Nom']
        const city_pattern_pattern = ['CITY', 'City', 'city', 'Ville', 'ville']
        const zip_code_pattern = ['Code postal ', 'zip', 'postal code', 'zip code', 'ZIP code', 'ZIP CODE', 'Postal Code', 'Code postal', 'code postal']
        const size_pattern = ['Taille US (disponibilités : de 4 à 13,5 US) ', 'Taille US (disponibilités : de 4 à 13,5 US)', 'size', 'sizes', 'size_eu', 'sizes_eu', 'size eu', 'sizes eu', 'size us', 'sizes us', 'Sizes US', 'Tailles U.S', 'Taille U.S',
                        'Size US', 'Sizes EU', 'Size EU', 'Size', 'Sizes', 'Pointures', 'Pointure', 'pointures', 'pointure', 'Tailles', 'Taille', 'Tailles U.S', 'Tailles US', 'Tailles EU', 'Taille E.U', 'Taille US (disponibilités : de 4 à 13,5 US) ', 'Taille US (disponibilités : de 4 à 13,5 US)']
        const instagram_account_pattern = ['ID Instagram', 'ID Instagram ', 'instagram', 'ig account', 'instagram account', 'Instagram account', 'Instagram']
        const country_pattern = ['Country', 'country', 'Pays', 'pays']
        const phone_number_pattern = ['phone', 'phone number', 'Phone Number', 'Phone number', 'Téléphone', 'Telephone', 'Numéro de téléphone ', 'Numéro de téléphone']
        const house_number_pattern = ['house number' ,'housenumber', 'huis nummer', 'huisnummer']
        const adress_line_1_pattern = ['address' ,'address line 1', 'address 1', 'street address', 'street', 'Street', 'Adresse', 'adresse', 'Adresse (numéro et rue)']
        const adress_line_2_pattern = ['address line 2', 'second adress', 'address 2', 'street adress 2']
        const adress_email_pattern = ['email', 'Adresse e-mail', 'email adress', 'address email', 'e-mail']
        const dob_pattern = ['birth', 'naissance', 'born', 'anniversary']
        const captcha_pattern = ['type this']
        const age_pattern = ['age']
        let fields: Field[] = script[1][1];
        for(let field of fields){
            const type = field[3];
            const label = field[1];
            console.log(`'${label}': type ${type}`);
            // Types that represent required fields
            const supportedTypes = [0,1,2,3,4,9];
            // Images or long description 
            const optionnalTypes = [6,11];
            if(!supportedTypes.includes(type)){
                if(optionnalTypes.includes(type)){
                    continue;
                }else{
                    throw new Error(`Unsupported field (id ${type}) "${label}", please contact an admin.`);
                }
            }
            const required = field[4]![0][2];
            if(!required) continue;
            const id = field[4]![0][0];
            console.log(` with id ${id}`);
            switch(type){
                case 4:
                case 3:
                case 2: {
                    const fieldOptions = field[4]![0][1];
                    if(!label){
                        // using first possible option of the options
                        this.form += `entry.${id}=${encodeURI(fieldOptions![0][0])}&`;
                    }else{
                        if(size_pattern.find(size => label.toLowerCase().includes(size.toLowerCase()))){
                            if(!options.size){
                                const size = fieldOptions![0][0];
                                this.form += `entry.${id}=${encodeURI(size)}&`;
                            }else{
                                let size = fieldOptions!.find(option => option[0].toLowerCase().includes(options.size!.toString().toLowerCase()))?.[0];
                                if(!size) size = fieldOptions![0][0];
                                this.form += `entry.${id}=${encodeURI(size)}&`;
                            }
                        }else if(country_pattern.find(country => country.toLowerCase().includes(label.toLowerCase()))){
                            if(!profile.country){
                                throw new Error("Please set a country inside the profile!");
                            }else{
                                let country = fieldOptions!.find(option => option[0].toLowerCase().includes(profile.country!.toString().toLowerCase()))?.[0];
                                if(!country) throw new Error("Canno't find your inputed country");
                                this.form += `entry.${id}=${encodeURI(country)}&`;
                            }
                        }else{
                            // using first possible option of the options
                            if (label.toLowerCase() === "how do you want to receive your sneakers? " || label.toLowerCase() === "how do you want to receive your sneakers?") {
                                this.form += `entry.${id}=Shipping+%28delivery+costs+may+vary+according+to+your+destination%29&`;
                            } else {
                                this.form += `entry.${id}=${encodeURI(fieldOptions![0][0])}&`;
                            }
                        
                        }
                    }
                    if(type === 2 || type === 4){
                        this.form += `entry.${id}_sentinel=&`;
                    }
                    break;
                }
                case 0:
                case 1:
                    if(first_name_pattern.find(fname => label.toLowerCase().includes(fname.toLowerCase()))){
                        this.form += `entry.${id}=${encodeURI(profile.fname)}&`;
                    } else if(last_name_pattern.find(lname => label.toLowerCase().includes(lname.toLowerCase()))){
                        this.form += `entry.${id}=${encodeURI(profile.lname)}&`;
                    } else if(full_name_pattern.find(fname => label.toLowerCase().includes(fname.toLowerCase()))){
                        this.form += `entry.${id}=${encodeURI(profile.fname+" "+profile.lname)}&`;
                    } else if(city_pattern_pattern.find(city => label.toLowerCase().includes(city.toLowerCase()))){
                        this.form += `entry.${id}=${encodeURI(profile.city!)}&`;
                    } else if(zip_code_pattern.find(zip => label.toLowerCase().includes(zip.toLowerCase()))){
                        this.form += `entry.${id}=${encodeURI(profile.zip!)}&`;
                    } else if(size_pattern.find(size => label.toLowerCase().includes(size.toLowerCase()))){
                        this.form += `entry.${id}=${encodeURI(options.size!.toString())}&`;
                    } else if(instagram_account_pattern.find(instagram => label.toLowerCase().includes(instagram.toLowerCase()))){
                        this.form += `entry.${id}=${encodeURI(profile.instagram!)}&`;
                    } else if(country_pattern.find(country => label.toLowerCase().includes(country.toLowerCase()))){
                        this.form += `entry.${id}=${encodeURI(profile.country!)}&`;
                    } else if(phone_number_pattern.find(phone => label.toLowerCase().includes(phone.toLowerCase()))){
                        this.form += `entry.${id}=${encodeURI(profile.phone!)}&`;
                    // Address email before address because "address"
                    } else if(adress_email_pattern.find(email => label.toLowerCase().includes(email.toLowerCase()))){
                        this.form += `entry.${id}=${encodeURI(profile.email)}&`;
                    // !address.toLowerCase().match(/(?:email)/mi) : so it doesn't match email field because of "address"
                    } else if(adress_line_1_pattern.find(address => label.toLowerCase().includes(address.toLowerCase()) && !address.toLowerCase().match(/(?:email)/mi))){
                        this.form += `entry.${id}=${encodeURI(profile.housenumber + " " + profile.address!)}&`;
                    } else if(house_number_pattern.find(address => label.toLowerCase().includes(address.toLowerCase()) && !address.toLowerCase().match(/(?:email)/mi))){
                        this.form += `entry.${id}=${encodeURI(profile.housenumber!)}&`;
                    } else if(adress_line_2_pattern.find(address => label.toLowerCase().includes(address.toLowerCase()) && !address.toLowerCase().match(/(?:email)/mi))){
                        this.form += `entry.${id}=${encodeURI(profile.address2!)}&`;
                    } else if(age_pattern.find(age => label.toLowerCase().includes(age.toLowerCase()))){
                        this.form += `entry.${id}=${encodeURI(randomBetween(18, 50).toString())}&`;
                    } else if(captcha_pattern.find(captcha => label.toLowerCase().includes(captcha.toLowerCase()))){
                        const solution = field[4]![0][4];
                        if(!solution || !solution[0][2][0]) throw new Error(`Unknown captcha ${label}, please contact an admin`);
                        this.form += `entry.${id}=${encodeURI(solution[0][2][0])}&`;
                    } else{
                        throw new Error(`Canno't parse the field ${label}, please contact an admin.`)
                    }
                    break;
                case 9:
                    if(dob_pattern.find(dob => label.toLowerCase().includes(dob.toLowerCase()))){
                        this.form += `entry.${id}_month=${profile.dob?.getMonth()}&`;
                        this.form += `entry.${id}_day=${profile.dob?.getDay()}&`;
                        this.form += `entry.${id}_year=${profile.dob?.getFullYear()}&`;
                    } else{
                        throw new Error(`Canno't parse the field ${label}, please contact an admin.`)
                    }
                    break;
                default:
                    console.log(`default`)
                    break;
            }
        }
    }

    getInputs($: cheerio.Root){
        const inputs = $('form input:not([name^="entry"]):not([class*="quantum"])');
        inputs.map((i, el) => {
            if($(el).attr("value") !== "" && $(el).attr("value") !== undefined){
                this.form += `entry.${$(el).attr("name")!}=${$(el).attr("value")}`;
            }
        });
        this.fbzx = $('input[name="fbzx"]').attr("name");
    }

}

export { GoogleForm }