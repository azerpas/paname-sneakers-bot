import {Starcow} from './index';
import 'global-agent/bootstrap';


jest.setTimeout(30000);

test("Testing Starcow:makeEntry", async () => {
    // @ts-ignore
    const frFaker = await import("faker/locale/fr");
    const a = new Starcow();
    const res = await a.makeEntry(
        {
            directUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd-k1KaOAM3i0_W7at8IKUib7OwHwn-KktXJfLabKG4zYOuPQ/viewform", 
            size: 42
        },
        {
            fname: frFaker.name.firstName(), 
            lname: frFaker.name.lastName(), 
            phone: frFaker.phone.phoneNumber(), 
            email: frFaker.internet.email(),
            city: frFaker.address.city(),
            country: frFaker.address.country(),
            instagram: frFaker.internet.userName(),
            housenumber: frFaker.random.number(4000).toString(),
            zip: frFaker.address.zipCode(),
            address: frFaker.address.streetName(),
        },
        null // account
    );
    expect(res.finalStatusCode).toBe(200);
});