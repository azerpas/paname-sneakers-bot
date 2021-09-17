import {TwoCaptcha} from "./index";
import { METHOD } from "../../helper";

jest.setTimeout(100000);

test("TwoCaptcha:sendRequest", async () => {
    const two = new TwoCaptcha({
        sitekey: "6LfG5soZAAAAAExFy9QD-KEWJ1f8reJRDYH5yptQ", 
        url: "https://2captcha.com/demo/recaptcha-v2?level=high", 
        method: METHOD.reCaptcha, 
        proxy: {ip: "", port: 22225, username: "", password: ""}, 
        apiKey: ""
    });
    const reqId = await two.sendRequest();
    expect(typeof reqId).toBe("string");
});

test("TwoCaptcha:sendAndGet", async () => {
    const two = new TwoCaptcha({
        sitekey: "6LfG5soZAAAAAExFy9QD-KEWJ1f8reJRDYH5yptQ", 
        url: "https://2captcha.com/demo/recaptcha-v2?level=high", 
        method: METHOD.reCaptcha, 
        proxy: {ip: "", port: 22225, username: "", password: ""}, 
        apiKey: ""
    });
    const reqId = await two.sendRequest();
    const res = await two.getResult(reqId);
    expect(typeof res).toBe("string");
});