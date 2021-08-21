import {TwoCaptcha} from "./index";
import { METHOD } from "../../helper";

jest.setTimeout(100000);

test("TwoCaptcha:sendRequest", async () => {
    const two = new TwoCaptcha({
        sitekey: "6LfG5soZAAAAAExFy9QD-KEWJ1f8reJRDYH5yptQ", 
        url: "https://2captcha.com/demo/recaptcha-v2?level=high", 
        method: METHOD.reCaptcha, 
        proxy: {ip: "zproxy.lum-superproxy.io", port: 22225, username: "lum-customer-paname-zone-yet-session-23323", password: "xwpn9i1t4inu"}, 
        apiKey: "12a5755eefb538792514196715f51b63"
    });
    const reqId = await two.sendRequest();
    expect(typeof reqId).toBe("string");
});

test("TwoCaptcha:sendAndGet", async () => {
    const two = new TwoCaptcha({
        sitekey: "6LfG5soZAAAAAExFy9QD-KEWJ1f8reJRDYH5yptQ", 
        url: "https://2captcha.com/demo/recaptcha-v2?level=high", 
        method: METHOD.reCaptcha, 
        proxy: {ip: "zproxy.lum-superproxy.io", port: 22225, username: "lum-customer-paname-zone-yet-session-23323", password: "xwpn9i1t4inu"}, 
        apiKey: "12a5755eefb538792514196715f51b63"
    });
    const reqId = await two.sendRequest();
    const res = await two.getResult(reqId);
    expect(typeof res).toBe("string");
});