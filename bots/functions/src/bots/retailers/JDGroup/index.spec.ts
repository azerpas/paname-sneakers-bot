import {JDFR} from './index'
import 'global-agent/bootstrap';
import { sendPayPalWebhook } from '../../../discord';


jest.setTimeout(30000);

test("Testing JDFR:makeEntry", async () => {
    const a = new JDFR();
    // @ts-ignore
    const frFaker = await import("faker/locale/fr");
    const url = "https://raffles.jdsports.fr/nike-air-max-genome-black-se97957r-1088"
    const customWebhook = "https://discord.com/api/webhooks/815520789176123413/qWq2MRFuvTl6JmG1ATwSVIFfvVw4aLmXt7p73UB8jfccsBNxELTiCUK2PGjnbNRfEOZo";
    const thumbnail = "https://cv.azerpas.com/assets/img/pic4.jpeg";
    const res = await a.makeEntry(
        {directUrl: url, size: 42, colorway: "orange"},
        {
            fname: frFaker.name.firstName(), 
            lname: frFaker.name.lastName(), 
            phone: frFaker.phone.phoneNumber(), 
            email: frFaker.internet.email(),
            address: frFaker.address.streetName(),
            housenumber: String(frFaker.random.number(100)),
            city: frFaker.address.city(),
            country: frFaker.address.country(),
            zip: frFaker.address.zipCode(),
            paypal: frFaker.internet.email()
        },
        null // account
    );
    console.log(`Received res: with finalStatusCode ${res.finalStatusCode}`);
    console.log(res);
    if(res.paypalUrl) await sendPayPalWebhook({website: "JDFR", customWebhook, thumbnail, productName:"nike-dunk-high-white-orange-blaze", email: "a@test.fr", paypalUrl: res.paypalUrl, size: "42", url})
    expect(201).toBe(201);
});