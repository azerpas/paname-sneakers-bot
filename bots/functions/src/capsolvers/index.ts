import { METHOD } from "../helper";
import { CaptchaParams } from "./types";

abstract class Solver {
    private sitekey: string;
    private url: string;
    protected method: METHOD; 
    private apiKey: string;
    private proxy: Proxy;
    private invisible: boolean;
    private version: string | undefined;
    private action: string | undefined;
    abstract in: string;
    abstract res: string;

    constructor(params: CaptchaParams){
        this.sitekey = params.sitekey;
        this.url = params.url;
        this.method = params.method;
        this.apiKey = params.apiKey;
        this.proxy = params.proxy;
        this.invisible = params.invisible || false;
        this.version = params.version || undefined;
        this.action = params.action || undefined;
    }

    abstract getMethodString(): string;

    abstract sendRequest(): Promise<string>;

    abstract getResult(id:string): Promise<string>;

    abstract getProxyString(): string;
    
    public getProxy = () => this.proxy;

    public getApiKey = () => this.apiKey;

    public getUrl = () => this.url;

    public getSiteKey = () => this.sitekey;
    
    public getInvisible = () => this.invisible;

    public getVersion = () => this.version;

    public getAction = () => this.action;

    public handleRequestError = (error: {response?: any, message?: string}) => {
        if(error.response){
            throw new ResError(`Status code: ${error.response.statusCode}, Response: ${error.response.body}`);
        }
        throw new ResError(error.message || "Error while handling request in solver");
    }
}

class InError extends Error{
    constructor(message: string){
        super(message);
        Object.setPrototypeOf(this, InError.prototype);
    }
    getMessage(m: string){
        return "Error while making in request to 2Captcha: "+m;
    }
}

class ResError extends Error{
    constructor(message: string){
        super(message);
        Object.setPrototypeOf(this, InError.prototype);
    }
    getMessage(m: string){
        return "Error while making res request to 2Captcha: "+m;
    }
}

export { Solver, InError, ResError }