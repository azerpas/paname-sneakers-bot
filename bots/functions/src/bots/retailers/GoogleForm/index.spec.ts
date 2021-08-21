import {GoogleForm} from './index'
import * as Faker from 'faker';
import 'global-agent/bootstrap';


jest.setTimeout(30000);

test("Testing GoogleForm:makeEntry", async () => {
    const a = new GoogleForm();
    const res = await a.makeEntry(
        {
            directUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdK3YuzVKtg0isG-n4K0DkaY_Oa4VpR2DT-cj91kCj0pCcc2Q/viewform", 
            size: 42
        },
        {
            fname: Faker.name.firstName(), 
            lname: Faker.name.lastName(), 
            phone: Faker.phone.phoneNumber(), 
            email: Faker.internet.email(),
            city: Faker.address.city(),
            country: Faker.address.country(),
            instagram: Faker.internet.userName()
        },
        null // account
    );
    expect(res.finalStatusCode).toBe(200);
});


test("Testing GoogleForm:makeEntry:test:skatestore", async () => {
    const a = new GoogleForm();
    const res = await a.makeEntry(
        {
            directUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfljC6hQI74u1zS1qduJmzQ9DECg4RtPvBwbeSqd2j4SYQEJA/viewform", 
            size: 42
        },
        {
            fname: Faker.name.firstName(), 
            lname: Faker.name.lastName(), 
            phone: Faker.phone.phoneNumber(), 
            email: Faker.internet.email(),
            city: Faker.address.city(),
            country: Faker.address.country(),
            instagram: Faker.internet.userName(),
            housenumber: "1",
            address: Faker.address.streetAddress(),
            zip: Faker.address.zipCode(),
            dob: new Date(23,12,1998)
        },
        null // account
    );
    expect(res.finalStatusCode).toBe(200);
});

test("Testing GoogleForm:makeEntry:test:Overkill", async () => {
    const a = new GoogleForm();
    const res = await a.makeEntry(
        {
            directUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdld94p4ILKLznP8jg2L54rwzXtPQjfBFAboxRurveILPu0fQ/viewform", 
            size: 42
        },
        {
            fname: Faker.name.firstName(), 
            lname: Faker.name.lastName(), 
            email: Faker.internet.email(),
            city: Faker.address.city(),
            address: Faker.address.streetAddress(),
            housenumber: "1",
            country: Faker.address.country(),
            zip: Faker.address.zipCode(),
            instagram: Faker.internet.userName(),
        },
        null // account
    );
    expect(res.finalStatusCode).toBe(200);
});