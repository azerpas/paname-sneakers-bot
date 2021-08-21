import {FootpatrolStore} from './index'
import * as Faker from 'faker';
import 'global-agent/bootstrap';


jest.setTimeout(30000);

test("Testing FP:makeEntry", async () => {
    const a = new FootpatrolStore();
    const res = await a.makeEntry(
        {
            directUrl: "https://footpatrol.s3.amazonaws.com/content/site/2017/RaffleForm_Assets/FootPatrolRafflePage_FR-blazer-readymade.html?fullTag=fr_adidas?shortTag=fr_adidas?prodcutName=Nike-Blazer-x-READYMADE?imgUrl=https://footpatrolblog.s3.amazonaws.com/wp-content/uploads/2021/02/NikeReadyMade_Blazer_Blog3.jpg", 
            size: 42,
            colorway: "Black"
        },
        {
            fname: Faker.name.firstName(), 
            lname: Faker.name.lastName(), 
            phone: Faker.phone.phoneNumber(), 
            email: Faker.internet.email(),
            city: Faker.address.city(),
            country: Faker.address.country(),
        },
        null // account
    );
    expect(res.finalStatusCode).toBe(200);
});