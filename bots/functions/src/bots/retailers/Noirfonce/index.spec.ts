import {Noirfonce} from './index'
import 'global-agent/bootstrap';


jest.setTimeout(140000);

test("Testing Noirfonce:makeEntry", async () => {
    const a = new Noirfonce("https://form.typeform.com/to/u9vqGgK0")
    const frFaker = await import("faker/locale/fr");
    const res = await a.makeEntry(
        {size: "42"},
        {
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
        },
        null // account
    );
    expect(res.finalStatusCode).toBe(200);
});

test("Testing Noir:makeEntry:panameio", async () => {
    const a = new Noirfonce("https://panameio.typeform.com/to/Xgba65UE")
    const frFaker = await import("faker/locale/fr");
    const res = await a.makeEntry(
        {size: "42"},
        {
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
        },
        null // account
    );
    expect(res.finalStatusCode).toBe(200);
});
