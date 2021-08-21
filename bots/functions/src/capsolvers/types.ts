import { METHOD } from "../helper";

type CaptchaParams = {
    sitekey: string;
    url: string;
    method: METHOD; 
    apiKey: string;
    proxy: Proxy;
    invisible?: boolean;
    version?: string;
    action?: string;
}

export { CaptchaParams }