import {Typeform} from './index'
import 'global-agent/bootstrap';

jest.setTimeout(140000);

let a = new Typeform("https://form.typeform.com/to/dMRVORcv");

test("Typeform parse url", async () => {
    expect(a.parseUrl()).toBe("dMRVORcv");
});

test("Typeform get signature and landedAt", async () => {
    await a.startSubmission();
    expect(a.landedAt).toBeLessThanOrEqual(Math.floor(Date.now()/1000));
});

test("Typeform get title", async () => {
    await a.scrapeInfos();
    expect(a.title).toBe("Air Jordan 1 Mid Wmns");
});

test("Typeform get userId", async () => {
    await a.scrapeInfos();
    expect(a.userId).toBe(12681081);
});

test("Typeform imitate insights", async () => {
    await a.scrapeInfos();
    await a.startSubmission();
    await a.imitateInsights();
    expect(a.timer).toBeLessThanOrEqual(60000);
});

test("Typeform submit", async () => {
    const frFaker = await import("faker/locale/fr");
    const profile = {
        fname: frFaker.name.firstName(), 
        lname: frFaker.name.lastName(), 
        phone: frFaker.phone.phoneNumber(), 
        email: frFaker.internet.email(),
        address: frFaker.address.streetName(),
        housenumber: String(frFaker.random.number(100)),
        city: frFaker.address.city(),
        country: "France",
        zip: frFaker.address.zipCode(),
        instagram: frFaker.internet.userName()
    }
    await a.scrapeInfos();
    await a.startSubmission();
    //await a.imitateInsights();
    expect((await a.submit("42", profile)).finalStatusCode).toBeLessThanOrEqual(200);
});

test("Typeform country code", async () => {
    expect(a.getCountryCode("algeria")).toBe("213");
});

test("Typeform submit:paname.io:stress95", async () => {
    a = new Typeform("https://panameio.typeform.com/to/mCf8uGmW")
    const frFaker = await import("faker/locale/fr");
    const profile = {
        fname: frFaker.name.firstName(), 
        lname: frFaker.name.lastName(), 
        phone: frFaker.phone.phoneNumber(), 
        email: frFaker.internet.email(),
        address: frFaker.address.streetName(),
        housenumber: String(frFaker.random.number(100)),
        city: frFaker.address.city(),
        country: "France",
        zip: frFaker.address.zipCode(),
        instagram: frFaker.internet.userName()
    }
    await a.scrapeInfos();
    await a.startSubmission();
    await a.imitateInsights();
    expect((await a.submit("42", profile)).finalStatusCode).toBeLessThanOrEqual(200);
});