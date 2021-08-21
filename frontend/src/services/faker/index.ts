import faker from "faker";

export const generateData = (column: string, locale: string = "en"): string => {
    faker.locale = locale;
    switch (column.toLowerCase()) {
        case "fname":
            return faker.name.firstName();
        case "lname":
            return faker.name.lastName();
        case "phone":
            return faker.phone.phoneNumber();
        case "email":
            return faker.internet.email(undefined, undefined, faker.random.arrayElement(['gmail.com', 'hotmail.com', 'outlook.com']));
        case "size":
            return faker.random.arrayElement(['42','41','40','43','44','45']);
        case "housenumber":
            return Math.floor(faker.random.number(4500))+"";
        case "address": 
        case "address2":
            return faker.address.streetName();
        case "state": 
            return faker.address.state();
        case "city": 
            return faker.address.city();
        case "zip":
            return faker.address.zipCode();
        case "country":
            return faker.address.country();
        case "zip":
            return faker.address.country();
        case "instagram":
            return faker.internet.userName();
        case "username":
            return faker.internet.userName();
        case "password":
            return faker.internet.password(10)
        case "paypal":
            return faker.internet.email(undefined, undefined, faker.random.arrayElement(['gmail.com', 'hotmail.com', 'outlook.com']));
        default:
            throw new Error("Not a recognized field");
    }
}