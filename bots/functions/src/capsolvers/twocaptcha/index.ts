import got/*, {Got} */from "got";
import {Solver, InError, ResError} from "../index";
import { METHOD } from "../../helper";
import { CaptchaParams } from "../../capsolvers/types";
import * as functions from 'firebase-functions';

class TwoCaptcha extends Solver{
    in: string;
    res: string;

    constructor(params: CaptchaParams){
        super(params);
        this.in = "https://2captcha.com/in.php";
        this.res = "https://2captcha.com/res.php";
    }

    getMethodString(): string {
        if(this.method === METHOD.reCaptcha) return "userrecaptcha";
        if(this.method === METHOD.hCaptcha) return "hcaptcha";
        return "userrecaptcha";
    }

    getProxyString(): string { // login:password@IP_address:PORT
        const _proxy = this.getProxy();
        return `${_proxy.username}:${_proxy.password}@${_proxy.ip}:${_proxy.port}`;
    }

    async sendRequest(): Promise<string> {
        const data: Record<string, string> = {
            key: this.getApiKey(),
            method: this.getMethodString(),
            googlekey: this.getSiteKey(),
            pageurl: this.getUrl(),
            json: "1",
            proxy: this.getProxyString(),
            proxytype: "HTTP",
            invisible: this.getInvisible() ? "1" : "0",
        }
        if(this.getVersion()) data.version = this.getVersion()!;
        if(this.getAction()) data.action = this.getAction()!;
        functions.logger.log(data);
        // TODO: Error handling https://2captcha.com/2captcha-api#in_errors
        const {statusCode, body}: InResponse = await got.post(this.in, { 
            body: new URLSearchParams(data).toString(),
            responseType: "json"
        })
            // TODO: .catch( (error) => this.handleRequestError(error) );
        if(statusCode === 200 && "request" in body){
            return body.request; // {"status":1,"request":"2122988149"}
        }else{
            throw new InError(JSON.stringify(body)+`\nStatus code: ${statusCode}`);
        }
    }

    async getResult(id: string, retried?: number): Promise<string> {
        const {statusCode, body} = await got.get(this.res+`?key=${this.getApiKey()}&action=get&id=${id}`)
            .catch( (error) => this.handleRequestError(error));
        if(statusCode !== 200) throw new ResError(`Status code: ${statusCode}, Response: ${body}`);
        if(body.includes("ERROR")) throw new ResError(`Status code: ${statusCode}, Response: ${body}`);
        if(body.includes("CAPCHA_NOT_READY")){
            if(retried && retried > 12) throw new ResError(`Waited more than a minute, times out.`);
            await new Promise((resolve) => { setTimeout(resolve, 5000); });
            return this.getResult(id, retried ? retried + 1 : 1);
        }else{
            return body.split("|")[1];
        }
    }
    
}

type InResponse = {
    statusCode: number,
    body: {
        status: string,
        request: string
    }
}

export { TwoCaptcha }