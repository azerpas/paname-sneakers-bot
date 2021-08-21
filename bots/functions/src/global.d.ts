export {}

declare global {
    namespace NodeJS {
        interface Global {
            GLOBAL_AGENT: { 
                HTTP_PROXY: string | undefined;
                HTTPS_PROXY: string | undefined;
                NO_PROXY: string | undefined;
            }
        }
    }
}