import {Azerpas} from './index'
import * as Faker from 'faker';
import 'global-agent/bootstrap';

jest.setTimeout(30000);

test("Testing Azerpas:makeEntry", async () => {
    const a = new Azerpas("http://entries.azerpas.com");
    const res = await a.makeEntry(
        {url: "/createEntry", size: 42, colorway: "Lavender"},
        {fname: Faker.name.firstName(), lname: Faker.name.lastName(), phone: Faker.phone.phoneNumber(), email: Faker.internet.email()},
        null // account
    );
    expect(res.finalStatusCode).toBe(200);
});