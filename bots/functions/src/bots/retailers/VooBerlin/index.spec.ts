import {VooBerlin} from './index'
import * as Faker from 'faker';
import 'global-agent/bootstrap';


jest.setTimeout(30000);

test("Testing Vooberlin:makeEntry", async () => {
    const a = new VooBerlin("https://raffle.vooberlin.com/index.php?");
    const res = await a.makeEntry(
        {directUrl: "https://raffle.vooberlin.com/index.php?alias=nike-dunk-low-retro-medium-curry", size: 42},
        {
            fname: Faker.name.firstName(), 
            lname: Faker.name.lastName(), 
            phone: Faker.phone.phoneNumber(), 
            email: Faker.internet.email(),
            address: Faker.address.streetName(),
            housenumber: String(Faker.random.number(100)),
            city: Faker.address.city(),
            country: Faker.address.country(),
            zip: Faker.address.zipCode()
        },
        null // account
    );
    expect(res.finalStatusCode).toBe(200);
});