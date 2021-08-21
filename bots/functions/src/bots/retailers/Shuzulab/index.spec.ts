import {Shuzu} from './index'
import * as Faker from 'faker';
import 'global-agent/bootstrap';


jest.setTimeout(140000);

test("Testing Shuzu:makeEntry", async () => {
    const a = new Shuzu("https://themintcompany.typeform.com/to/a8Ad71CT")
    const res = await a.makeEntry(
        {size: "42"},
        {
            fname: Faker.name.firstName(), 
            lname: Faker.name.lastName(), 
            email: Faker.internet.email(),
            country: "france",
        },
        null // account
    );
    expect(res.finalStatusCode).toBe(200);
});

test("Testing Shuzu:makeEntry:panameio", async () => {
    const a = new Shuzu("https://panameio.typeform.com/to/DvXBRisV")
    const res = await a.makeEntry(
        {size: "42"},
        {
            fname: Faker.name.firstName(), 
            lname: Faker.name.lastName(), 
            email: Faker.internet.email(),
            country: "france",
        },
        null // account
    );
    expect(res.finalStatusCode).toBe(200);
});